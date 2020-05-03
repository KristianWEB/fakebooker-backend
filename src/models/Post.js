const { model, Schema } = require("mongoose");

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  body: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [] }],
});

const Post = model("Post", PostSchema);

module.exports = Post;
