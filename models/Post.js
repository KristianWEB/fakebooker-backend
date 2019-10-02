const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Comment = require("./Comment");

const PostSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  destination: {
    type: ObjectId, // User who received the post(whose wall?)
    required: true,
    ref: "User",
  },
  typeOfPost: {
    type: String,
    enum: ["text", "image"], // TODO: add more enum types
    default: "text",
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
  lastEditedDate: { type: Number, default: null },
  comments: { type: [Comment.schema], default: [] },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
