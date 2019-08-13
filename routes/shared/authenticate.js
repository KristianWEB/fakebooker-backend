const passport = require('passport');

// Returns the authenticated user information based on token sent in Authorization header
module.exports = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) reject({ err, user });
      user = JSON.parse(JSON.stringify(user));
      resolve(user);
    })(req, res, next);
  });
};
