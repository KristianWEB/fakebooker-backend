const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const {
  // validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const getAuthenticatedUser = require("../middlewares/authenticated");

const generateToken = require("../../util/generateToken");

module.exports = {
  Query: {
    loadUser: async (_, __, context) => {
      const { user, token } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new Error("Unauthenticated!");
      }

      return {
        token,
        ...user,
      };
    },
    loadUserFromDB: async (_, __, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(authUser.id);

      return user;
    },
    loadFromUrlUser: async (_, { username }) => {
      const user = await User.findOne({ username });
      return user;
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
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
      // const { valid, errors } = validateRegisterInput(
      //   firstName,
      //   lastName,
      //   email,
      //   birthday,
      //   gender,
      //   password
      // );

      // if (!valid) {
      //   throw new UserInputError("Errors", { errors });
      // }

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
  },
};
