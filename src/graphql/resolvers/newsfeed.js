const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getNewsfeed: async (_, __, context) => {
      try {
        const { user } = await getAuthenticatedUser({ context });

        if (!user) {
          throw new AuthenticationError("Unauthenticated!");
        }

        const posts = await Post.find({})
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
          .sort("createdAt");
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
