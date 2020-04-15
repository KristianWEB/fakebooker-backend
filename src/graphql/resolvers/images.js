require("dotenv").config();
const { AuthenticationError } = require("apollo-server");
const cloudinary = require("cloudinary");
const getAuthenticatedUser = require("../middlewares/authenticated");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = {
  Mutation: {
    deleteImage: async (_, { publicId }, context) => {
      const { user } = await getAuthenticatedUser({ context });

      if (!user) {
        throw new AuthenticationError("Unauthenticated!");
      }
      cloudinary.uploader.destroy(publicId);

      return "Image deleted successfully";
    },
  },
};
