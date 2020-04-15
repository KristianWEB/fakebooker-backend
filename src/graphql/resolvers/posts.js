const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getPosts: async (_, __, context) => {
      try {
        const { user } = await getAuthenticatedUser({ context });

        const posts = await Post.find({ userId: user.id })
          .populate("userId", "firstName lastName avatarImage")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "firstName lastName avatarImage",
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
    getUrlPosts: async (_, { username }) => {
      try {
        const user = await User.findOne({ username });

        const posts = await Post.find({ userId: user.id })
          .populate("userId", "firstName lastName avatarImage")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "firstName lastName avatarImage",
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
    createPost: async (_, { body, image }, context) => {
      const { user } = await getAuthenticatedUser({ context });
      if (!user) {
        throw new Error("Unauthenticated!");
      }

      const newPost = new Post({
        body,
        image,
        userId: user.id,
      });
      const post = await newPost
        .save()
        .then(t =>
          t.populate("userId", "firstName lastName avatarImage").execPopulate()
        );
      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const { user } = await getAuthenticatedUser({ context });

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
