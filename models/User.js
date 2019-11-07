const mongoose = require("mongoose");

const { Schema } = mongoose;

const bcrypt = require("bcryptjs");
const Post = require("./Post");

const UserSchema = new Schema({
  email: { required: true, type: String },
  username: { required: true, type: String },
  displayName: { type: String, required: true },
  profileImage: {
    type: String,
    default: "https://www.w3schools.com/w3images/avatar2.png",
  },
  coverImage: {
    type: String,
    default: "https://www.w3schools.com/w3images/avatar2.png",
  },
  joinDate: { type: Number, required: true, default: Date.now() },
  lastLogin: { type: Number, required: true, default: Date.now() },
  status: {
    isDeactivated: { type: Boolean, default: false },
    lastActiveDate: { type: Number, default: Date.now() },
  },
  about: {
    dob: Number,
    bio: String,
  },
  password: { required: true, type: String },
  roles: { type: Array, default: ["user"] },
  posts: { type: [Post.schema], required: true },
});

UserSchema.statics.findByEmail = function(email, projection, opts) {
  return this.findOne({ email }, projection, opts);
};

UserSchema.statics.findByUsername = function(username, projection, opts) {
  return this.findOne({ username }, projection, opts);
};

UserSchema.methods.add = function() {
  return new Promise(resolve => {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) throw err;

      const name = this.email.substring(0, this.email.lastIndexOf("@"));
      this.displayName = name;
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
