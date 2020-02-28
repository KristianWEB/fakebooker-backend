const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getPosts: async (_, __, context) => {
      try {
        const { user } = getAuthenticatedUser(context);

        const posts = await Post.find({ userId: user.id })
          .populate("userId", "firstName lastName coverImage")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "firstName lastName coverImage",
            },
          })
          .sort({
            creationDate: -1,
          });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const { user } = getAuthenticatedUser(context);
      if (!user) {
        throw new Error("Unauthenticated!");
      }

      const newPost = new Post({
        body,
        userId: user.id,
      });
      const post = await newPost
        .save()
        .then(t =>
          t.populate("userId", "firstName lastName coverImage").execPopulate()
        );
      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const { user } = getAuthenticatedUser(context);

      try {
        const post = await Post.findById(postId);
        if (user.id === post.userId.toString()) {
          await post.delete();
          return "Post deleted successfully";
        }
        throw new AuthenticationError("Action not allowed");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
