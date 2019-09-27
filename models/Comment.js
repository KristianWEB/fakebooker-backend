const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CommentSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  content: { type: String, required: true },
  creationDate: { type: Number, default: Date.now },
  likedBy: {
    type: [ObjectId],
    default: [],
    ref: "User",
  },
  disLikedBy: {
    type: [ObjectId],
    default: [],
    ref: "User",
  },
  edited: { type: Boolean, default: false },
  lastEditedDate: {
    type: Number,
    default: null,
    // must set lastEditedDate to something if edited is true
    required() {
      return this.edited;
    },
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
