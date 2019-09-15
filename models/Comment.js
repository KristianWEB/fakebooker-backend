const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  id: String,
  userId: String,
  content: String,
  creationDate: Number,
  likedBy: [
    {
      id: String,
    },
  ],
  disLikedBy: [
    {
      id: String,
    },
  ],
  edited: Boolean,
  lastEditedDate: Number,
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
