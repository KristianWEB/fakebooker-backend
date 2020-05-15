const { UserInputError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const getAuthenticatedUser = require("../middlewares/authenticated");
const generateToken = require("../../util/generateToken");

module.exports = {
  Query: {
    loadUser: async (_, __, context) => {
      const { user, token } = await getAuthenticatedUser({
        context,
        newToken: true,
      });
      if (!user) {
        throw new Error("Unauthenticated!");
      }

      return {
        token,
        ...user._doc,
        id: user._id,
      };
    },
    loadFromUrlUser: async (_, { username }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const user = await User.findOne({ username }).populate(
        "friends",
        "id firstName lastName avatarImage username"
      );
      return user;
    },
    getUsers: async (_, __, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const users = await User.find({});

      return users;
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findByEmail(email);

      if (!user) {
        throw new UserInputError("Wrong email or password");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match || email !== user.email) {
        throw new UserInputError("Wrong email or password");
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    register: async (
      _,
      {
        registerInput: {
          firstName,
          lastName,
          email,
          birthday,
          gender,
          password,
        },
      }
    ) => {
      const user = await User.findByEmail(email);
      if (user) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        birthday,
        gender,
        password,
      });

      const savedUser = await newUser.add();

      const token = generateToken(newUser);
      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      };
    },
    changeAvatarImage: async (_, { avatarImage }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          avatarImage,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
    changeCoverImage: async (_, { coverImage }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const newUser = await User.findOneAndUpdate(
        {
          _id: user.id,
        },
        {
          coverImage,
        },
        {
          new: true,
        }
      );

      return newUser;
    },
  },
};
