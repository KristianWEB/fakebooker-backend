const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  source: { required: true, type: String },
  destination: { required: true, type: String },
  typeOfPost: { required: true, type: String },
  content: { type: String, default: "" },
  creationDate: { required: true, type: Number, default: Date.now() },
  likesCount: { requierd: true, type: Number, default: 0 },
  dislikesCount: { requierd: true, type: Number, default: 0 },
  likedBy: [
    {
      id: String,
      username: String,
      displayName: String,
      profileImage: String,
    },
  ],
  disLikedBy: [
    {
      id: String,
      username: String,
      displayName: String,
      profileImage: String,
    },
  ],
  comments: [], // to be filled with comment model
  edited: { required: true, type: Boolean, default: false },
  lastEditedDate: { required: true, type: Number, default: Date.now() },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
