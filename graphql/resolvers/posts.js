// const { AuthenticationError } = require("apollo-server-express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const props = require("../../config/properties");

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

        const posts = await Post.find({ user: user._id }).sort({
          createdAt: -1,
        });
        return { posts, author: user };
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
        user: user._id,
      });

      const post = await newPost.save();
      return post;
    },
  },
};
