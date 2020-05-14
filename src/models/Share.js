const { model, Schema } = require("mongoose");

const ShareSchema = new Schema({
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

const Share = model("Share", ShareSchema);

module.exports = Share;
