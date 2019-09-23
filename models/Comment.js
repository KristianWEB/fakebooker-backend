const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = mongoose.Schema({
  userId: ObjectId,
  content: String,
  creationDate: Number,
  likedBy: [ObjectId],
  disLikedBy: [ObjectId],
  edited: Boolean,
  lastEditedDate: Number,
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
