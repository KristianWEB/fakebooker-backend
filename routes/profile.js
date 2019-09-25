const express = require("express");

const router = express.Router();
const User = require("../models/User");
const { verifyToken, getUser } = require("./shared/authenticate");

router.get("/", verifyToken, getUser, async (req, res) => {
  try {
    res.json({
      success: true,
      info: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName,
        profileImage: req.user.profileImage,
        coverImage: req.user.coverImage,
        posts: req.user.posts,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const dbUser = await User.findByUsername(username);
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
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
});

router.get("/:username/about", async (req, res) => {
  try {
    const { username } = req.params;

    const dbUser = await User.findByUsername(username);
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        msg: `User with username ${username} doesn't exist`,
      });
    }
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
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
});

module.exports = router;
