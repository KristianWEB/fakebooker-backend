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
        status: "pending",
      });

      return notification;
    },
    acceptFriend: async (_, { creator }, context) => {
      const { user: notifierUser } = await getAuthenticatedUser({
        context,
        newToken: true,
      });

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
          friends: [creatorUser.id, ...notifierUser.friends],
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
          friends: [notifierUser.id, ...creatorUser.friends],
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

      // remove the notification
      const notification = await Notification.findOneAndDelete({
        creator: creatorUser.id,
        notifier: notifierUser.id,
        action: "Sent you a friend request",
      });

      return notification.id;
    },
    removeFriend: async (_, { creator }, context) => {
      const { user: userA } = await getAuthenticatedUser({
        context,
        newToken: true,
        dontPopulate: true,
      });

      if (!userA) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const userB = await User.findOne({ username: creator });

      // remove the notification ( for both sides, creator and notifier should be passed as params cuz we dont know who is the creator, neither the notifier)
      await Notification.findOneAndDelete({
        creator: userB.id,
        notifier: userA.id,
        action: "Sent you a friend request",
      });

      // try the other way around because we dont know who is the creator and the notifier
      await Notification.findOneAndDelete({
        creator: userA.id,
        notifier: userB.id,
        action: "Sent you a friend request",
      });

      // remove userB's ID from userA's friends array
      const newFriendsArrUserA = userA.friends.filter(
        friendId => friendId.toString() !== userB.id.toString()
      );

      await User.findOneAndUpdate(
        { _id: userA.id },
        { $set: { friends: newFriendsArrUserA } },
        { new: true }
      );

      // remove userA's ID from userB's friends array
      const newFriendsArrUserB = userB.friends.filter(
        friendId => friendId.toString() !== userA.id.toString()
      );

      await User.findOneAndUpdate(
        { _id: userB.id },
        { $set: { friends: newFriendsArrUserB } },
        { new: true }
      );

      const newUser = await User.findById(userA.id).populate(
        "friends",
        "firstName lastName avatarImage id username"
      );

      return newUser;
    },
  },
};
