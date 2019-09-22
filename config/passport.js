const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const config = require("config");
const User = require("../models/User");

const secret = config.get("jwtSecret");

module.exports = passport => {
  const opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = secret;
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.getUserById(jwtPayload._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      });
    })
  );
};
