const { UserInputError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

const User = require("../../models/User");
const { validateRegisterInput } = require("../../util/validators");

const generateToken = user => {
  return jwt.sign(
    {
      roles: user.roles,
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    secret,
    {
      expiresIn: 604800,
    }
  );
};

module.exports = {
  Mutation: {
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
        id: savedUser._id,
        token,
      };
    },
  },
};
