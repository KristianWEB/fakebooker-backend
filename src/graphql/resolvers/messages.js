const { AuthenticationError, PubSub, withFilter } = require("apollo-server");
const mongoose = require("mongoose");
const Message = require("../../models/Message");
const Thread = require("../../models/Thread");
const getAuthenticatedUser = require("../middlewares/authenticated");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getConversations: async (_, __, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      // https://stackoverflow.com/a/41376967/11017666
      const conversations = await Thread.aggregate([
        {
          $match: {
            participantsIds: {
              $in: [mongoose.Types.ObjectId(authUser.id)],
            },
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "threadId",
            as: "messages",
          },
        },
        {
          $unwind: "$messages",
        },
        {
          $sort: {
            "messages.createdAt": -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            participantsIds: { $first: "$participantsIds" },
            latestMessage: { $first: "$messages" },
          },
        },
        // once we structure all converasations with latest messages, populate each message's creator and notifier
        {
          $lookup: {
            from: "users",
            localField: "latestMessage.creator",
            foreignField: "_id",
            as: "latestMessage.creator",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "latestMessage.notifier",
            foreignField: "_id",
            as: "latestMessage.notifier",
          },
        },
        {
          $unwind: "$latestMessage.creator",
        },
        {
          $unwind: "$latestMessage.notifier",
        },
      ]);

      return conversations;
    },
    getSingleChat: async (_, { threadId }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }
      const messages = await Message.find({
        threadId,
      })
        .populate("creator", "firstName lastName avatarImage")
        .populate("notifier", "firstName lastName avatarImage");

      return messages;
    },
  },
  Mutation: {
    createMessage: async (_, { notifier, body, threadId }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const message = await Message({
        creator: authUser.id,
        threadId,
        notifier,
        body,
      })
        .save()
        .then(t =>
          t
            .populate("creator", "id firstName lastName avatarImage")
            .execPopulate()
        )
        .then(t =>
          t
            .populate("notifier", "id firstName lastName avatarImage")
            .execPopulate()
        );

      pubsub.publish("NEW_MESSAGE", {
        newMessage: message,
        notifierId: notifier,
      });

      return message;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("NEW_MESSAGE"),
        (payload, variables) => {
          return (
            payload.newMessage.notifier.id.toString() ===
            variables.notifierId.toString()
          );
        }
      ),
    },
  },
};
