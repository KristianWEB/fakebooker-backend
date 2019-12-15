const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Comment = require("./Comment");

const LikeSchema = new Schema({
  username: { type: String, required: true },
  creationDate: { type: String, required: true },
});

const PostSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  author: {
    username: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  destination: {
    type: ObjectId, // User who received the post(whose wall?)
    // assume it should be posted to user's wall if not set other wise
    default() {
      return this.author.userId;
    },
    ref: "User",
  },
  typeOfPost: {
    type: String,
    enum: ["text", "image"], // TODO: add more enum types
    default: "text",
  },
  content: { type: String, required: true },
  creationDate: { type: Number, default: Date.now },
  edited: { type: Boolean, default: false },
  lastEditedDate: {
    type: Number,
    default: null,
    // must set lastEditedDate to something if edited is true
    required() {
      return this.edited;
    },
  },
  comments: {
    type: [Comment.Schema],
    default: [],
  },

  likes: {
    type: [LikeSchema],
    default: [],
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
