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
          creationDate: -1,
        });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { content, username }, context) => {
      const { user } = getAuthenticatedUser(context);
      if (!user) {
        throw new Error("Unauthenticated!");
      }
      const newPost = new Post({
        content,
        user: user._id,
        username,
      });

      const post = await newPost.save();
      return post;
    },
  },
};
