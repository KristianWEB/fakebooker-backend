require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = user => {
  return jwt.sign(
    {
      roles: user.roles,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthday: user.birthday,
      coverImage: user.coverImage,
      avatarImage: user.avatarImage,
      gender: user.gender,
      username: user.username,
      workPlace: user.workPlace,
    },
    process.env.JWT_SECRET || "YOURSECRET",
    {
      expiresIn: 604800,
    }
  );
};
