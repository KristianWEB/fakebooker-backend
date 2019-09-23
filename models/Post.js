const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const Comment = require("./Comment");

const PostSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  }, // Reference to id of user that made the post
  destination: ObjectId, // ObjectId of person who received the post(whose wall?)
  typeOfPost: String, // Type of post[i.e., text, image, url like reddit?]
  content: String,
  creationDate: Number,
  likedBy: [ObjectId], // ObjectId of the user,
  disLikedBy: [ObjectId], // ObjectId of the user,
  edited: Boolean,
  lastEditedDate: Number,
  comments: [Comment.schema],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

module.exports.getPostsById = user => Post.find({ user });
