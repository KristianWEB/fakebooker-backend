const jwt = require("jsonwebtoken");
const props = require("../../config/properties");

const secret = props.JWT_SECRET;

const User = require("../../models/User");

module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, displayName } }
    ) => {
      const newUser = new User({
        email,
        password,
        username,
        displayName,
      });
      // check if username or email is already taken
      try {
        const errors = [];
        let user = await User.findByEmail(newUser.email);
        if (user) errors.push(`User already exists with email`);
        user = await User.findByUsername(newUser.username);
        if (user) errors.push(`User already exists with username`);
        if (Object.keys(errors).length > 0) {
          return {
            errors,
          };
        }
        // const savedUser = await newUser.add();
        const token = jwt.sign(jwtData(newUser), secret, {
          expiresIn: 604800, // 1 week
        });
        return {
          // success: true,
          // msg: "User registered",
          user: {
            token: `JWT ${token}`,
            // id: savedUser._id,
            email: newUser.email,
            username: newUser.username,
            displayName: newUser.displayName,
            coverImage: "https://www.w3schools.com/w3images/avatar2.png",
            status: {
              isDeactivated: false,
              lastActiveDate: Date.now().toString(),
            },
          },
        };
      } catch (err) {
        return {
          errors: ["Some error occurred while registering the user"],
        };
      }
    },
  },
};

const jwtData = user => ({
  roles: user.roles,
  _id: user._id,
  email: user.email,
  username: user.username,
  displayName: user.displayName,
});
