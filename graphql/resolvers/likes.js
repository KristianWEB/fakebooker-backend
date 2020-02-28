const { UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const Like = require("../../models/Like");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const { user } = getAuthenticatedUser(context);

      const post = await Post.findById(postId).populate(
        "likes",
        "userId postId createdAt"
      );
      if (post) {
        if (
          post.likes.find(postLike => postLike.userId.toString() === user.id)
        ) {
          post.likes = post.likes.filter(
            postLike => postLike.userId.toString() !== user.id
          );
          await Like.find({ userId: user.id }).deleteOne();

          await post.save();
        } else {
          // not liked post
          const newLike = new Like({
            postId: post.id,
            userId: user.id,
          });
          const like = await newLike.save();

          post.likes.push(like._id);
        }
        await post
          .save()
          .then(t =>
            t
              .populate("userId", "firstName lastName avatarImage")
              .execPopulate()
          )
          .then(t =>
            t.populate("likes", "userId postId createdAt").execPopulate()
          );
        return post;
      }
      throw new UserInputError("Post Not Found");
    },
  },
};
