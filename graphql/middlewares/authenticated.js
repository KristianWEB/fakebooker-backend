const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

module.exports = context => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("JWT ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, secret);
        return {
          token,
          user,
        };
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'JWT [token]");
  }
  throw new Error("Authorization header must be provided");
};
