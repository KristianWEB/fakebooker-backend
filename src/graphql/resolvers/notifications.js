const { PubSub } = require("apollo-server");
const Notification = require("../../models/Notification");
const getAuthenticatedUser = require("../middlewares/authenticated");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getNotifications: async (_, __, context) => {
      const { user } = getAuthenticatedUser(context);

      try {
        const notifications = await Notification.find({
          notifier: user.id,
        })
          .populate("creator", "firstName lastName avatarImage")
          .populate("notifier", "firstName lastName avatarImage")
          .populate("actionId", "body");

        return notifications;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createNotification: async ({ creatorId, notifierId, actionId, action }) => {
      const notification = await Notification({
        creator: creatorId,
        notifier: notifierId,
        actionId,
        action,
      })
        .save()
        .then(t => t.populate("actionId", "body").execPopulate())
        .then(t =>
          t.populate("creator", "firstName lastName avatarImage").execPopulate()
        )
        .then(t =>
          t
            .populate("notifier", "firstName lastName avatarImage")
            .execPopulate()
        );

      pubsub.publish("NEW_NOTIFICATION", {
        newNotification: notification,
      });
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
