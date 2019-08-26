const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../config/database");
const User = require("../models/user");
const getAuthenticatedUser = require("./shared/authenticate");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  try {
    const user = await User.getUserByEmail(newUser.email);

    if (user) {
      return res.status(409).json({
        success: false,
        msg: `User already exists with email ${newUser.email}`
      });
    }
    await User.addUser(newUser);

    return res.json({
      success: true,
      msg: "User registered"
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      msg: "Some error occurred while registering the user"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  try {
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        msg: "User not found"
      });
    }

    const result = await User.comparePassword(password, user.password);

    if (result) {
      const token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: 604800 // 1 week
      });

      return res.json({
        success: true,
        token: `JWT ${token}`,
        user: {
          id: user._id,
          email: user.email
        }
      });
    }

    return res.json({
      success: false,
      msg: "Wrong password"
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      msg: "Some error occurred while logging in"
    });
  }
});

/*
 * Test endpoint
 * Try hitting this without Auth header, you will/should 401 error
 */
router.get("/test", async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req, res, next);

    return res.json({
      success: true,
      user: _.omit(user, ["_id", "password", "__v"])
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "You are unauthorized"
    });
  }
});

module.exports = router;
