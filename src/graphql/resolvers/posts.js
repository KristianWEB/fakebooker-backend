const { AuthenticationError, PubSub } = require("apollo-server");

const Post = require("../../models/Post");
const Like = require("../../models/Like");
const Comment = require("../../models/Comment");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");

const pubsub = new PubSub();

module.exports = {
  Query: {
    getPosts: async (_, __, context) => {
      try {
        const { user } = await getAuthenticatedUser({ context });

        const posts = await Post.find({ userId: user.id })
          .populate("userId", "firstName lastName avatarImage username")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "id firstName lastName avatarImage username",
            },
          })
          .sort("-createdAt");
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    getSinglePost: async (_, { postId }, context) => {
      try {
        const { user } = await getAuthenticatedUser({ context });

        if (!user) {
          throw new AuthenticationError("Unauthenticated!");
        }

        const post = await Post.findById(postId)
          .populate("userId", "firstName lastName avatarImage username")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "id firstName lastName avatarImage username",
            },
          })
          .sort("-createdAt");
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
    getUrlPosts: async (_, { username }) => {
      try {
        const user = await User.findOne({ username });

        const posts = await Post.find({ userId: user.id })
          .populate("userId", "firstName lastName avatarImage username")
          .populate("likes", "userId postId createdAt")
          .populate("comments", "userId postId createdAt body")
          .populate({
            path: "comments",
            populate: {
              path: "userId",
              model: "User",
              select: "id firstName lastName avatarImage username",
            },
          })
          .sort("-createdAt");
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
          t
            .populate("userId", "id firstName lastName avatarImage username")
            .execPopulate()
        );
      pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      try {
        const post = await Post.findById(postId);
        if (user.id === post.userId.toString()) {
          await Like.find({
            postId: post.id,
          }).deleteMany();

          await Comment.find({
            postId: post.id,
          }).deleteMany();

          await post.delete();
          return "Post deleted successfully";
        }
        throw new AuthenticationError("Action not allowed");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: () => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
