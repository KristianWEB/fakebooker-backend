const express = require("express");

const router = express.Router();
const { check, validationResult } = require("express-validator");

const Post = require("../models/Post");

const { verifyToken } = require("./shared/authenticate");

// @route   POST api/posts
// @desc    Create a post
// @access  Private (User with token can add their posts)
router.post(
  "/",
  verifyToken,
  [
    check("text", "Text is required")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { _id } = req.payload;

      const newPost = new Post({
        user: _id,
        content: req.body.text,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const { _id } = req.payload;

    const posts = await Post.getPostsById(_id);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
  }
});

/*
 * Test endpoint
 * Returns error without "Authentication" & return user id with token
 */
router.get("/test", verifyToken, (req, res) => {
  try {
    const { _id } = req.payload;

    return res.json({
      success: true,
      user: _id,
    });
  } catch (err) {
    console.error(err.message);

    return res.status(401).json({
      success: false,
      msg: "You are unauthorized",
    });
  }
});

module.exports = router;
