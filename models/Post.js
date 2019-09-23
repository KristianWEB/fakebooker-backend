const mongoose = require("mongoose");
const Comment = require("./Comment");

const { Schema } = mongoose;

const PostSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, // Reference to id of user that made the post
  destination: String, // ObjectId of person who received the post(whose wall?)
  typeOfPost: String, // Type of post[i.e., text, image, url like reddit?]
  content: String,
  creationDate: Number,
  likedBy: [
    {
      id: String, // ObjectId of the user,
    },
  ],
  disLikedBy: [
    {
      id: String, // ObjectId of the user,
    },
  ],
  edited: Boolean,
  lastEditedDate: Number,
  comments: [Comment.schema],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

module.exports.getPostsById = user => Post.find({ user });
