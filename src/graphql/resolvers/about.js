const { AuthenticationError } = require("apollo-server");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Mutation: {
    addWorkplace: async (_, { body }, context) => {
      const { user } = getAuthenticatedUser(context);

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          workPlace: body,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    deleteWorkplace: async (_, __, context) => {
      const { user } = getAuthenticatedUser(context);

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $unset: { workPlace: 1 } },
        { new: true }
      );

      return newUser;
    },
    addSchool: async (_, { body }, context) => {
      const { user } = getAuthenticatedUser(context);

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          school: body,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    deleteSchool: async (_, __, context) => {
      const { user } = getAuthenticatedUser(context);

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $unset: { school: 1 } },
        { new: true }
      );

      return newUser;
    },
  },
};
