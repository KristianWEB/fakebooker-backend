const { AuthenticationError, PubSub } = require("apollo-server");
const Message = require("../../models/Message");
const Thread = require("../../models/Thread");
const getAuthenticatedUser = require("../middlewares/authenticated");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getMessages: async (_, __, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      // TODO: to make messages notification right => fetch all threads => fetch latestmessage of the thread ( creator/notifier authUser ) and save it into array
      // THIS CURRENTLY DOESNT WORK
      // const conversation = await Promise.all(
      //   threads.map(async thread => {
      //     // for each thread we find the latest message and s
      //     const message = await Message.findOne({
      //       $or: [
      //         {
      //           threadId: thread.id,
      //           creator: authUser.id,
      //         },
      //         {
      //           threadId: thread.id,
      //           notifier: authUser.id,
      //         },
      //       ],
      //     })
      //       .sort("-createdAt")
      //       .populate("creator", "firstName lastName avatarImage")
      //       .populate("notifier", "firstName lastName avatarImage");
      // })
      // );

      const messages = await Message.find({
        notifier: authUser.id,
      })
        .populate("creator", "firstName lastName avatarImage")
        .populate("notifier", "firstName lastName avatarImage");

      return messages;
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
      });

      return message;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator("NEW_MESSAGE"),
    },
  },
};
