const passport = require("passport");

// Returns the authenticated user information based on token sent in Authorization header
module.exports = (req, res, next) =>
  new Promise((resolve, reject) => {
    // keeping info here just in case we need it later
    // eslint-disable-next-line no-unused-vars
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        reject(new Error("Authentication failed: ", err));
        // reject({
        //   err,
        //   user,
        // });
      }
      user = JSON.parse(JSON.stringify(user));
      resolve(user);
    })(req, res, next);
  });
