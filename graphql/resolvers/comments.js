const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { user } = getAuthenticatedUser(context);
      if (!user) {
        throw new Error("Unauthenticated!");
      }

      if (body.trim() === "") {
        throw new Error("Comment can't be empty!");
      }
      const post = await Post.findOne({ _id: postId });
      if (post) {
        const newComment = new Comment({
          body,
          postId,
          userId: user.id,
        });
        const comment = await newComment.save();

        post.comments.push(comment._id);

        await post
          .save()
          .then(t =>
            t.populate("userId", "firstName lastName coverImage").execPopulate()
          )
          .then(t =>
            t.populate("likes", "userId postId createdAt").execPopulate()
          )
          .then(t =>
            t
              .populate(
                "comments",
                "firstName lastName coverImage postId createdAt body"
              )
              .execPopulate()
          )
          .then(t =>
            t
              .populate({
                path: "comments",
                populate: {
                  path: "userId",
                  model: "User",
                  select: "firstName lastName coverImage",
                },
              })
              .execPopulate()
          );

        return post;
      }
      throw new Error("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { user } = getAuthenticatedUser(context);

      const post = await Post.findOne({ _id: postId });

      if (post) {
        const comment = await Comment.findById(commentId);

        if (comment.userId.toString() === user.id) {
          post.comments.splice(comment, 1);

          await Comment.find({ userId: user.id }).deleteOne();

          await post
            .save()
            .then(t =>
              t
                .populate("userId", "firstName lastName coverImage")
                .execPopulate()
            )
            .then(t =>
              t.populate("likes", "userId postId createdAt").execPopulate()
            )
            .then(t =>
              t
                .populate("comments", "userId postId createdAt body")
                .execPopulate()
            )
            .then(t =>
              t
                .populate({
                  path: "comments",
                  populate: {
                    path: "userId",
                    select: "firstName lastName coverImage",
                    model: "User",
                  },
                })
                .execPopulate()
            );
          return post;
        }
        throw new Error("Action not allowed");
      } else {
        throw new Error("Post not found");
      }
    },
  },
};
