const mongoose = require("mongoose");
const Comment = require("./Comment");

const PostSchema = mongoose.Schema({
  source: String, // ObjectId of person who made the post
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
