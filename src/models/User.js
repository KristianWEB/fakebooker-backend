const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  username: { required: true, type: String },
  email: { required: true, type: String },
  avatarImage: {
    type: String,
    default:
      "https://scontent.fsof4-1.fna.fbcdn.net/v/t1.30497-1/c71.0.240.240a/p240x240/84241059_189132118950875_4138507100605120512_n.jpg?_nc_cat=1&_nc_sid=7206a8&_nc_ohc=CD3ImewvDlgAX8f-QvY&_nc_ht=scontent.fsof4-1.fna&oh=782172992e9272da49f35f7f40ef8d63&oe=5EED0201",
  },
  coverImage: {
    type: String,
  },
  gender: { required: true, type: String },
  birthday: { type: Date },
  password: { required: true, type: String },
  workPlace: { type: String },
  homePlace: { type: String },
  school: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

UserSchema.statics.findByEmail = function(email, projection, opts) {
  return this.findOne({ email }, projection, opts);
};

UserSchema.methods.add = function() {
  return new Promise(resolve => {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) throw err;
      const username = `${this.firstName}.${
        this.lastName
      }${shortid.generate()}`;
      this.username = username.toLowerCase();
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
