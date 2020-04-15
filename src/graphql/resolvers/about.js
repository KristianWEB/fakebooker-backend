const { AuthenticationError } = require("apollo-server");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Mutation: {
    addWorkplace: async (_, { body }, context) => {
      const { user } = await getAuthenticatedUser({ context });

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
      const { user } = await getAuthenticatedUser({ context });

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
      const { user } = await getAuthenticatedUser({ context });

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
      const { user } = await getAuthenticatedUser({ context });

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
    addGender: async (_, { gender }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          gender,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    deleteGender: async (_, __, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $unset: { gender: 1 } },
        { new: true }
      );

      return newUser;
    },
    addBirthday: async (_, { birthday }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          birthday,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    deleteBirthday: async (_, __, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $unset: { birthday: 1 } },
        { new: true }
      );

      return newUser;
    },
    addHomeplace: async (_, { homePlace }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          homePlace,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    deleteHomeplace: async (_, __, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $unset: { homePlace: 1 } },
        { new: true }
      );

      return newUser;
    },
  },
};
