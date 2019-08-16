const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  roles: { default: ['user'] },
  type: [String],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserById = (id, callback) => User.findById(id, callback);

module.exports.getUserByEmail = (email) => User.findOne({ email }).exec();

module.exports.addUser = (newUser) => {
  bcrypt.genSalt(10, (_, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
      newUser.password = hash;

      return newUser.save();
    });
  });
};

module.exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);
