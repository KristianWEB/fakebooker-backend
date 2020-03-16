const Notification = require("../../models/Notification");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getNotifications: async (_, __, context) => {
      const { user } = getAuthenticatedUser(context);
      console.log(user);

      try {
        const notifications = await Notification.find({
          notifier: user.id,
        })
          .populate("creator", "firstName lastName avatarImage")
          .populate("notifier", "firstName lastName avatarImage")
          .populate("actionId", "body");
        console.log(notifications);

        return notifications;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createNotification: async ({ creatorId, notifierId, actionId, action }) => {
      await new Notification({
        creator: creatorId,
        notifier: notifierId,
        actionId,
        action,
      }).save();
    },
  },
};
