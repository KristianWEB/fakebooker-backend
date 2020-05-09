require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateToken = require("../../util/generateToken");
const User = require("../../models/User");

const secret = process.env.JWT_SECRET || "YOURSECRET";

module.exports = async ({ context, newToken, dontPopulate }) => {
  const authHeader = context.req.headers.authorization;
  let user = null;
  let token = null;
  if (authHeader) {
    /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
    token = authHeader.split("JWT ")[1];
    if (token) {
      user = jwt.verify(token, secret);
    }
  }
  if (newToken) {
    const newUser = await User.findById(user.id).populate(
      "friends",
      "firstName lastName avatarImage id username"
    );

    token = generateToken(newUser);
    user = newUser;
  }
  if (newToken && dontPopulate) {
    const newUser = await User.findById(user.id);
    token = generateToken(newUser);
    user = newUser;
  }

  return {
    token,
    user,
  };
};
