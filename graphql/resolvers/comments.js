const { PubSub } = require("apollo-server");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

const pubsub = new PubSub();
const COMMENT_ADDED = "COMMENT_ADDED";

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
        ;
      }

      let post = await Post.findOne({ _id: postId });
      if (post) {
        const comment = new Comment({
          body,
          userId: user._id,
          author: {
            username: user.username,
            coverImage: user.coverImage,
          },
          creationDate: new Date().toISOString(),
        });
        post.comments.push(comment);
        post = post.save();
        pubsub.publish(COMMENT_ADDED, { comment });
        return post;
      }
      throw new Error("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { user } = getAuthenticatedUser(context);

      const post = await Post.findOne({ _id: postId });

      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId);

        if (post.comments[commentIndex].author.username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        }
        throw new Error("Action not allowed");
      } else {
        throw new Error("Post not found");
      }
    },
  },
  Subscription: {
    commentAdded: {
      subscribe: () => pubsub.asyncIterator(COMMENT_ADDED),
    },
  },
};
