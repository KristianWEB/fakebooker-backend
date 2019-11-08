const jwt = require("jsonwebtoken");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

module.exports = context => {
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
  return {
    token,
    user,
  };
};
