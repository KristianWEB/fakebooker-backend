const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

const User = require("../../models/User");
const {
  // validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const getAuthenticatedUser = require("../middlewares/authenticated");

const generateToken = user => {
  return jwt.sign(
    {
      roles: user.roles,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      coverImage: user.coverImage,
      avatarImage: user.avatarImage,
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
      if (!user) {
        throw new Error("Unauthenticated!");
      }
      return {
        token,
        ...user,
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

      // check if username or email is already taken

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
