const User = require("../../models/User");

// np xD
module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password } },
      { _req, res }
    ) => {
      try {
        const errors = {};
        let newUser = await User.findByEmail(newUser.email);
        if (newUser) errors.email = `User already exists with email`;

        newUser = await User.findByUsername(username);
        if (newUser) errors.username = `User already exists with username`;

        if (Object.keys(errors).length > 0) {
          return res.status(409).json({
            success: false,
            errors,
          });
        }

        const savedUser = await newUser.add();

        const token = jwt.sign(jwtData(newUser), secret, {
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
      return {
        username,
        email,
        password,
        displayName: "Bob",
        token: "Dummy",
        coverImage: "",
        statusValue: {
          isDeactivated: false,
          lastActiveDate: Date.now(),
        },
      };
    },
  },
};
