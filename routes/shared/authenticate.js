const passport = require("passport");

// Returns the authenticated user information based on token sent in Authorization header
module.exports = (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user) {
        reject(new Error("Authentication failed: ", err));
      }
      user = JSON.parse(JSON.stringify(user));
      resolve(user);
    })(req, res, next);
  });
