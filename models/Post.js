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

// const LikeSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   createdAt: { type: Number, default: Date.now() },
// });

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  body: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
  comments: {
    type: [CommentSchema],
    default: [],
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
});

const Post = model("Post", PostSchema);

module.exports = Post;
