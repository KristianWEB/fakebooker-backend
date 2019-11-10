// const { AuthenticationError } = require("apollo-server-express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const props = require("../../config/properties");

const Post = require("../../models/Post");

// const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getPost: async (_, { username }) => {
      try {
        const posts = await Post.find({ username }).sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
