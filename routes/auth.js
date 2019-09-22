const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../config/database");
const User = require("../models/User");
const getAuthenticatedUser = require("./shared/authenticate");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });

  // check if username or email is already taken
  try {
    const errors = {};
    let user = await User.getUserByEmail(newUser.email);
    if (user) errors.email = `User already exists with email`;

    user = await User.getUserByUsername(newUser.username);
    if (user) errors.username = `User already exists with username`;

    if (Object.keys(errors).length > 0) {
      return res.status(409).json({
        success: false,
        errors,
      });
    }

    const savedUser = await User.addUser(newUser);

    const token = jwt.sign(jwtData(newUser), config.secret, {
      expiresIn: 604800, // 1 week
    });

    return res.json({
      success: true,
      msg: "User registered",
      token: `JWT ${token}`,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      msg: "Some error occurred while registering the user",
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
        msg: "User not found",
      });
    }

    const result = await User.comparePassword(password, user.password);

    if (result) {
      const token = jwt.sign(jwtData(user), config.secret, {
        expiresIn: 604800, // 1 week
      });

      return res.json({
        success: true,
        token: `JWT ${token}`,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    }

    return res.json({
      success: false,
      msg: "Wrong password",
    });
  } catch (err) {
    return res.status(409).json({
      success: false,
      msg: "Some error occurred while logging in",
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
      user: _.omit(user, ["_id", "password", "__v"]),
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "You are unauthorized",
    });
  }
});

// Other methods
// method that returns object which will be put into jwt token
const jwtData = user => ({
  roles: user.roles,
  id: user._id,
  email: user.email,
  username: user.username,
  displayName: user.displayName,
});

module.exports = router;
