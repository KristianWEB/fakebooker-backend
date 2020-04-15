const { AuthenticationError } = require("apollo-server");
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");
const notifications = require("./notifications.js");

module.exports = {
  Mutation: {
    addFriend: async (_, { notifier }, context) => {
      const { user: creator } = await getAuthenticatedUser({ context });

      if (!creator) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const notifierUser = await User.findOne({ username: notifier });

      const notification = await notifications.Mutation.createNotification({
        creatorId: creator.id,
        notifierId: notifierUser.id,
        action: "Sent you a friend request",
      });

      return notification;
    },
    acceptFriend: async (_, { creator }, context) => {
      const { user: notifierUser } = await getAuthenticatedUser({ context });

      if (!notifierUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const creatorUser = await User.findOne({ username: creator });

      // add userA to userB's friends array
      await User.findOneAndUpdate(
        {
          _id: notifierUser.id,
        },
        {
          friends: [creatorUser.id],
        },
        {
          new: true,
        }
      );

      // add userB to userA's friends array
      await User.findOneAndUpdate(
        {
          _id: creatorUser.id,
        },
        {
          friends: [notifierUser.id],
        },
        {
          new: true,
        }
      );
      // update the notification's status to accepted
      const notification = await Notification.findOneAndUpdate(
        {
          creator: creatorUser.id,
          notifier: notifierUser.id,
          action: "Sent you a friend request",
        },
        {
          status: "accepted",
        },
        {
          new: true,
        }
      )
        .then(t =>
          t.populate("creator", "firstName lastName avatarImage").execPopulate()
        )
        .then(t =>
          t
            .populate("notifier", "firstName lastName avatarImage")
            .execPopulate()
        );

      return notification;
    },
    rejectFriend: async (_, { creator }, context) => {
      const { user: notifierUser } = await getAuthenticatedUser({ context });

      if (!notifierUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const creatorUser = await User.findOne({ username: creator });
      console.log(notifierUser);
      console.log(creatorUser);

      // remove the notification
      const notification = await Notification.findOneAndDelete({
        creator: creatorUser.id,
        notifier: notifierUser.id,
        action: "Sent you a friend request",
      });

      return notification.id;
    },
    removeFriend: async (_, { creator }, context) => {
      const { user: notifierUser } = await getAuthenticatedUser({
        context,
        newToken: true,
      });

      if (!notifierUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const creatorUser = await User.findOne({ username: creator });

      // remove the notification
      const notification = await Notification.findOneAndDelete({
        creator: creatorUser.id,
        notifier: notifierUser.id,
        action: "Sent you a friend request",
      });

      // remove userA's ID from userB's friends array
      const newFriendsArrUserA = notifierUser.friends.filter(
        friendId => friendId.toString() !== creatorUser.id.toString()
      );

      await User.findOneAndUpdate(
        { _id: creatorUser.id },
        { $unset: { friends: newFriendsArrUserA } },
        { new: true }
      );

      // remove userB's ID from userA's friends array
      const newFriendsArrUserB = creatorUser.friends.filter(
        friendId => friendId.toString() !== notifierUser.id.toString()
      );

      await User.findOneAndUpdate(
        { _id: notifierUser.id },
        { $unset: { friends: newFriendsArrUserB } },
        { new: true }
      );

      return notification.id;
    },
  },
};
