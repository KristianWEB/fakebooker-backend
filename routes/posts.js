const express = require("express");

const router = express.Router();
const _ = require("lodash");
const { check, validationResult } = require('express-validator');

const Post = require("../models/Post");

const getAuthenticatedUser = require("./shared/authenticate");

// Creates post and stores it in DB
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
      const userId = await getAuthenticatedUser(req, res);

      const newPost = new Post({
        user: userId,
        content: req.body.text,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

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
