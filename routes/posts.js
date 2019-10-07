const express = require("express");
const passport = require("passport");

const router = express.Router();
const { check, validationResult } = require("express-validator");

const Post = require("../models/Post");
const User = require("../models/User");

// GET POSTS BY USERNAME
router.get("/user/:username", async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "There is no user by that username",
      });
    }

    const postsQuery = Post.find()
      .or([{ user: user._id }, { destination: user._id }])
      .select("-__v");

    const { recent, sortBy } = req.query;

    if (+recent) {
      postsQuery.sort({ creationDate: -1 }).limit(+recent);
    }

    if (sortBy) {
      postsQuery.sort({ [sortBy]: -1 });
    }

    populatePostField(postsQuery);

    const posts = await postsQuery;
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
});

// Any endpoints above this will be Public
router.use((req, res, next) => {
  // have to wrap the authenticate method to use global err handling middeware and custom responses
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
});
// Any endpoints below this will be Private

// @route   GET api/posts
// @desc    Get all posts
// @access  Private  (User with token can add their posts)
router.get("/", async (req, res, next) => {
  try {
    const { _id } = req.user;

    const postsQuery = Post.find()
      .or([{ user: _id }, { destination: _id }])
      .select("-__v");

    const { recent } = req.query;

    // try converting recent to a number to see if its a valid number.
    if (+recent) {
      postsQuery.sort({ creationDate: -1 }).limit(+recent);
    }
    populatePostField(postsQuery);

    const posts = await postsQuery;
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private (User with token can add their posts)
router.post(
  "/",
  [
    check("content", "content is required")
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { _id } = req.user;
      const { content, destination, typeOfPost } = req.body;

      const newPost = new Post({
        user: _id,
        content,
        typeOfPost,
        destination,
      });

      let post = await newPost.save();

      post = await populatePostField(post).execPopulate();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  }
);

// UPDATE POST BY ID
router.patch(
  "/:id",
  [
    check("content", "content is required")
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { typeOfPost, content } = req.body;

      const update = {
        ...(typeOfPost && { typeOfPost }),
        content,
        edited: true,
        lastEditedDate: Date.now(),
      };

      let post = await Post.findByIdAndUpdate(id, update, { new: true });
      if (!post) {
        return res.status(404).json({
          success: false,
          msg: "Post Not Found",
        });
      }
      post = await populatePostField(post).execPopulate();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  }
);

// UPDATE POST STATUS BY ID
router.patch("/status/:id", async (req, res, next) => {
  try {
    const { like, dislike } = req.body;
    if (like && dislike) {
      return res.status(400).json({
        success: false,
        msg: "like and dislike fields can't both be defined",
      });
    }

    const { _id } = req.user;

    // A user can't both like and dislike a post at the same time
    const update = {
      // remove user from disLikedBy array if they already disliked the post
      ...(like && { $pullAll: { disLikedBy: [_id] } }),

      ...(like > 0 && { $addToSet: { likedBy: _id } }),
      ...(like < 0 && { $pullAll: { likedBy: [_id] } }),

      // remove user from likedBy array if they already liked the post
      ...(dislike && { $pullAll: { likedBy: [_id] } }),

      ...(dislike > 0 && { $addToSet: { disLikedBy: _id } }),
      ...(dislike < 0 && { $pullAll: { disLikedBy: [_id] } }),
    };

    const { id } = req.params;

    await Post.findByIdAndUpdate(id, update);

    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
});

// DELETE POST BY ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
});

// Global Error Handling Middleware
router.use((err, req, res) => {
  console.error(err);
  return res.status(500).json({
    success: false,
    msg: "Internal Server Error",
  });
});

module.exports = router;

// Helper function to populate queries and documents
function populatePostField(post) {
  return post
    .populate("user", "username profileImage -_id")
    .populate("destination", "username profileImage -_id")
    .populate("likedBy", "username profileImage -_id")
    .populate("disLikedBy", "username profileImage -_id");
}
