const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  body: String,
  createdAt: { type: Date, default: Date.now },
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
