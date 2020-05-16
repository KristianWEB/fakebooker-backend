const { UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const Like = require("../../models/Like");
const getAuthenticatedUser = require("../middlewares/authenticated");
const notifications = require("./notifications");

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const { user } = await getAuthenticatedUser({ context });

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

          if (user.id !== post.userId.toString()) {
            notifications.Mutation.deleteNotification({
              creator: user.id,
              actionId: post._id,
            });
          }

          await post.save();
        } else {
          // not liked post
          const newLike = new Like({
            postId: post.id,
            userId: user.id,
          });
          const like = await newLike.save();

          post.likes.push(like._id);

          if (user.id !== post.userId.toString()) {
            notifications.Mutation.createNotification({
              creatorId: user.id,
              notifierId: post.userId,
              actionId: post._id,
              action: "has liked your post",
            });
          }
        }
        await post
          .save()
          .then(t =>
            t
              .populate("userId", "id firstName lastName avatarImage username")
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
