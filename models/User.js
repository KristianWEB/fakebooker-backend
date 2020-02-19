const mongoose = require("mongoose");

const { Schema } = mongoose;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String },
  avatarImage: {
    type: String,
    default: "https://www.w3schools.com/w3images/avatar2.png",
  },
  coverImage: {
    type: String,
    default: "https://www.w3schools.com/w3images/avatar2.png",
  },
  gender: { required: true, type: String },
  birthday: { type: Number, default: Date.now() },
  password: { required: true, type: String },
  roles: { type: Array, default: ["user"] },
});

UserSchema.statics.findByEmail = function(email, projection, opts) {
  return this.findOne({ email }, projection, opts);
};

UserSchema.methods.add = function() {
  return new Promise(resolve => {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) throw err;
      this.password = hash;

      this.save((error, savedObj) => {
        if (error) throw error;
        resolve(savedObj);
      });
    });
  });
};

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
