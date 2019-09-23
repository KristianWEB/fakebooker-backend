const express = require("express");

const router = express.Router();
const _ = require("lodash");

const Post = require("../models/Post");
const User = require("../models/User");

const getAuthenticatedUser = require("./shared/authenticate");

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
