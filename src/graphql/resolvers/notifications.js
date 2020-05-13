const { PubSub, AuthenticationError } = require("apollo-server");
const Notification = require("../../models/Notification");
const getAuthenticatedUser = require("../middlewares/authenticated");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getNotifications: async (_, __, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const notifications = await Notification.find({
        notifier: user.id,
      })
        .populate("creator", "firstName lastName avatarImage username")
        .populate("notifier", "firstName lastName avatarImage username")
        .populate("actionId", "body id")
        .sort("-createdAt");

      return notifications;
    },
    getSingleNotification: async (_, { urlUser }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const notification = await Notification.findOne({
        $or: [
          {
            notifier: authUser.id,
            creator: urlUser,
            action: "Sent you a friend request",
          },
          {
            notifier: urlUser,
            creator: authUser.id,
            action: "Sent you a friend request",
          },
        ],
      })
        .populate("creator", "firstName lastName avatarImage username")
        .populate("notifier", "firstName lastName avatarImage username");

      return notification;
    },
  },
  Mutation: {
    createNotification: async ({
      creatorId,
      notifierId,
      actionId,
      action,
      status,
    }) => {
      const notification = await Notification({
        creator: creatorId,
        notifier: notifierId,
        actionId,
        action,
        status,
      })
        .save()
        .then(t => t.populate("actionId", "body id").execPopulate())
        .then(t =>
          t
            .populate("creator", "firstName lastName avatarImage username")
            .execPopulate()
        )
        .then(t =>
          t
            .populate("notifier", "firstName lastName avatarImage username")
            .execPopulate()
        );

      pubsub.publish("NEW_NOTIFICATION", {
        newNotification: notification,
      });

      return notification;
    },
    deleteNotification: async ({ creator, actionId }) => {
      const notification = await Notification.findOne({ creator, actionId });

      const { _id } = notification;

      pubsub.publish("DELETE_NOTIFICATION", { deleteNotification: _id });

      await notification.deleteOne();
    },
  },
  Subscription: {
    newNotification: {
      subscribe: () => pubsub.asyncIterator("NEW_NOTIFICATION"),
    },
    deleteNotification: {
      subscribe: () => pubsub.asyncIterator("DELETE_NOTIFICATION"),
    },
  },
};
