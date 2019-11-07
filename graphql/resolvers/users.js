const { UserInputError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const getAuthenticatedUser = require("../middlewares/authenticated");

const generateToken = user => {
  return jwt.sign(
    {
      roles: user.roles,
      _id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      coverImage: user.coverImage,
      status: {
        isDeactivated: user.status.isDeactivated,
        lastActiveDate: user.status.lastActiveDate,
      },
    },
    secret,
    {
      expiresIn: 604800,
    }
  );
};

module.exports = {
  Query: {
    loadUser: (_, __, context) => {
      const { user, token } = getAuthenticatedUser(context);
      return {
        ...user,
        token,
      };
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
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // check if username or email is already taken
      let user = await User.findByUsername(username);
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      user = await User.findByEmail(email);
      if (user) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }

      const newUser = new User({
        email,
        password,
        username,
      });
      const token = generateToken(newUser);

      const savedUser = await newUser.add();
      return {
        ...savedUser._doc,
        token,
      };
    },
  },
};
