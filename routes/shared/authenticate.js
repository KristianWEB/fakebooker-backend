const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/properties");
const User = require("../../models/User");

module.exports = {
  verifyToken: (req, res, next) => {
    // Don't throw err if authorization header is undefined
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      req.payload = payload;
      return next();
    });
  },
  getUser: (req, res, next) => {
    // expects verifyToken middleware to come first
    const { _id } = req.payload;

    User.findById(_id, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      req.user = user;
      return next();
    });
  },
};
