const { model, Schema } = require("mongoose");

const LikeSchema = new Schema({
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
  createdAt: { type: Date, default: Date.now },
});

const Like = model("Like", LikeSchema);

module.exports = Like;
