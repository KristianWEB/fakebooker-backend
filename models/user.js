const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: { type: [String], default: ["user"] }
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = (id, callback) => User.findById(id, callback);

module.exports.getUserByEmail = email => User.findOne({ email }).exec();

module.exports.addUser = newUser => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      return newUser.save();
    });
  });
};

module.exports.comparePassword = (candidatePassword, hash) =>
  bcrypt.compare(candidatePassword, hash);
