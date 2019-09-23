const express = require("express");

const router = express.Router();
const _ = require("lodash");
const { check, validationResult } = require("express-validator");

const Post = require("../models/Post");

const getAuthenticatedUser = require("./shared/authenticate");

// @route   POST api/posts
// @desc    Create a post
// @access  Private (User with token can add their posts)
router.post(
  "/",
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
      const newPost = new Post({
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
router.get("/", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req, res);
    const userId = _.pick(user, ["_id"]);

    const posts = await Post.getPostsById(userId);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
  }
});

/*
 * Test endpoint
 * Returns error without "Authentication" & return user id with token
 */
router.get("/test", async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req, res, next);

    return res.json({
      success: true,
      user: _.pick(user, ["_id"]),
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
