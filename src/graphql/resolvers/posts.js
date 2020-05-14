const { AuthenticationError, PubSub } = require("apollo-server");

const mongoose = require("mongoose");
const Post = require("../../models/Post");
const Share = require("../../models/Share");
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

        // const posts = await Post.find({ userId: user.id })
        //   .populate("userId", "firstName lastName avatarImage")
        //   .populate("likes", "userId postId createdAt")
        //   .populate("comments", "userId postId createdAt body")
        //   .populate({
        //     path: "comments",
        //     populate: {
        //       path: "userId",
        //       model: "User",
        //       select: "firstName lastName avatarImage",
        //     },
        //   })
        //   .sort("-createdAt");

        // TODO: find all shared posts by user ( find )
        // TODO: READ THIS AGAIN https://stackoverflow.com/a/36023726/11017666
        const share = await Share.findOne({
          userId: user.id,
        });

        const sharedPosts = await Post.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      shares: {
                        $in: [mongoose.Types.ObjectId(share.id)],
                      },
                    },
                    {
                      userId: mongoose.Types.ObjectId(user.id),
                    },
                  ],
                },
              ],
            },
          },
          {
            $sort: {
              "posts.createdAt": -1,
            },
          },
          {
            $lookup: {
              from: "shares",
              localField: "shares",
              foreignField: "_id",
              as: "shares",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "likes",
              foreignField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "comments",
              foreignField: "_id",
              as: "comments",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "comments.userId",
              foreignField: "_id",
              as: "comments.userId",
            },
          },
          // {
          //   $group: {
          //     _id: "$_id",
          //     comments: { $push: "$comments" },
          // userId: "$userId",
          // createdAt: "$createdAt",
          // body: "$body",
          // image: "$image",
          // },
          // },
        ]);

        return sharedPosts;
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
          t.populate("userId", "firstName lastName avatarImage").execPopulate()
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
    sharePost: async (_, { postId }, context) => {
      const { user } = await getAuthenticatedUser({ context });
      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }

      const post = await Post.findById(postId);

      const share = await new Share({
        postId: post.id,
        userId: user.id,
      }).save();

      post.shares.push(share.id);

      await post
        .save()
        .then(t =>
          t.populate("shares", "userId postId createdAt").execPopulate()
        );

      return post;
    },
  },
  Subscription: {
    newPost: {
      subscribe: () => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
