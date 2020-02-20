const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
  username: String,
  body: String,
  creationDate: String,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  author: {
    username: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
});

const LikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: { type: Number, default: Date.now() },
});

const PostSchema = new Schema({
  author: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  body: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
  comments: {
    type: [CommentSchema],
    default: [],
  },
  likes: {
    type: [LikeSchema],
    default: [],
  },
});

const Post = model("Post", PostSchema);

module.exports = Post;
