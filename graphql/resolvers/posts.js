const { AuthenticationError } = require("apollo-server-express");
const { UserInputError } = require("apollo-server-express");
const Post = require("../../models/Post");
const User = require("../../models/User");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getPosts: async (_, { username }) => {
      try {
        const user = await User.findByUsername(username);
        if (!user) {
          throw new Error("There is no user by that username");
        }

        const posts = await Post.find({ userId: user._id }).sort({
          creationDate: -1,
        });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { content }, context) => {
      const { user } = getAuthenticatedUser(context);
      if (!user) {
        throw new Error("Unauthenticated!");
      }

      const newPost = new Post({
        content,
        userId: user._id,
        author: {
          username: user.username,
          coverImage: user.coverImage,
        },
      });
      const post = await newPost.save();
      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const user = getAuthenticatedUser(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.author.username) {
          await post.delete();
          return "Post deleted successfully";
        }
        throw new AuthenticationError("Action not allowed");
      } catch (err) {
        throw new Error(err);
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = getAuthenticatedUser(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // post was already liked
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // not liked post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      }
      throw new UserInputError("Post Not Found");
    },
  },
};
