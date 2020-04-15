const jwt = require("jsonwebtoken");
const props = require("../../config/properties");
const generateToken = require("../../util/generateToken");
const User = require("../../models/User");

const secret = props.JWT_SECRET;

module.exports = async ({ context, newToken }) => {
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
    const newUser = await User.findById(user.id);

    token = generateToken(newUser);
    user = newUser;
  }

  return {
    token,
    user,
  };
};
