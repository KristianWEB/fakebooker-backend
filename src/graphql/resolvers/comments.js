const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const getAuthenticatedUser = require("../middlewares/authenticated");
const notifications = require("./notifications");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { user } = await getAuthenticatedUser({ context });
      if (!user) {
        throw new Error("Unauthenticated!");
      }
      const post = await Post.findOne({ _id: postId });
      if (post) {
        const newComment = new Comment({
          body,
          postId,
          userId: user.id,
        });
        const comment = await newComment
          .save()
          .then(t =>
            t
              .populate("userId", "id firstName lastName avatarImage username")
              .execPopulate()
          );

        post.comments.push(comment._id);

        if (user.id !== post.userId.toString()) {
          notifications.Mutation.createNotification({
            creatorId: user.id,
            notifierId: post.userId,
            actionId: post._id,
            action: "has commented on your post",
          });
        }

        await post.save();

        return comment;
      }
      throw new Error("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      const post = await Post.findById(postId).populate("userId", "id");

      if (post) {
        const comment = await Comment.findById(commentId).populate(
          "userId",
          "id firstName lastName avatarImage username"
        );

        if (
          comment.userId.id.toString() === user.id ||
          post.userId.id.toString() === user.id
        ) {
          post.comments = post.comments.filter(
            cId => cId.toString() !== commentId
          );
          await Comment.findById(commentId).deleteOne();

          if (user.id !== post.userId.id.toString()) {
            await notifications.Mutation.deleteNotification({
              creator: user.id,
              actionId: post.id,
            });
          }

          await post.save();

          return comment;
        }
        throw new Error("Action not allowed");
      } else {
        throw new Error("Post not found");
      }
    },
  },
};
