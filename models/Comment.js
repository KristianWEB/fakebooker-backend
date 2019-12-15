const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CommentSchema = new Schema({
  id: ObjectId,
  username: String,
  body: String,
  creationDate: String,
  userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  author: {
    username: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
