const express = require("express");

const router = express.Router();
const User = require("../models/User");
const getAuthenticatedUser = require("./shared/authenticate");

router.get("/:username?", async (req, res, next) => {
  try {
    let username;
    if (req.params.username) username = req.params.username;
    else {
      const user = await getAuthenticatedUser(req, res, next);
      username = user.username;
    }

    if (!username) {
      return res.status(401).json({
        success: false,
        msg: "You are unauthorized",
      });
    }

    const dbUser = await User.getUserByUsername(username);
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        msg: `User with username ${username} doesn't exist`,
      });
    }

    return res.json({
      success: true,
      info: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        displayName: dbUser.displayName,
        profileImage: dbUser.profileImage,
        coverImage: dbUser.coverImage,
        posts: dbUser.posts,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "You are unauthorized",
    });
  }
});

router.get("/:username/about/", async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req, res, next);
    const username = req.params.username || user.username;
    if (!username) {
      return res.status(401).json({
        success: false,
        msg: "You are unauthorized",
      });
    }

    const dbUser = await User.getUserByUsername(username);
    return res.json({
      success: true,
      info: {
        email: dbUser.email,
        username: dbUser.username,
        displayName: dbUser.displayName,
        joinDate: dbUser.joinDate,
        lastLogin: dbUser.lastLogin,
        lastActiveDate: dbUser.lastActiveDate,
        dob: dbUser.dob,
        bio: dbUser.bio,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "You are unauthorized",
    });
  }
});

module.exports = router;
