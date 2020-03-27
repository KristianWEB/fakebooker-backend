const jwt = require("jsonwebtoken");
const props = require("../config/properties");

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
    },
    props.JWT_SECRET,
    {
      expiresIn: 604800,
    }
  );
};
