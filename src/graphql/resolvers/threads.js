const { AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const Thread = require("../../models/Thread");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
  Query: {
    getThread: async (_, { urlUser }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }

      // aggregate always returns an array that's why im returning the first element [0]. Only 1 thread can exist between 2 users that's why it's not a problem.
      const thread = await Thread.aggregate([
        {
          $match: {
            participantsIds: {
              $in: [
                mongoose.Types.ObjectId(authUser.id),
                mongoose.Types.ObjectId(urlUser),
              ],
            },
          },
        },
      ]);

      return {
        ...thread[0],
        id: thread[0]._id,
      };
    },
  },
  Mutation: {
    createThread: async (_, { urlUser }, context) => {
      const { user: authUser } = await getAuthenticatedUser({ context });

      if (!authUser) {
        throw new AuthenticationError("Unauthenticated!");
      }
      let thread;

      thread = await Thread.findOne({
        $or: [
          {
            participantsIds: [authUser.id, urlUser],
          },
          {
            participantsIds: [urlUser, authUser.id],
          },
        ],
      });

      if (!thread) {
        thread = await Thread({
          participantsIds: [authUser.id, urlUser],
        }).save();
      }

      return thread;
    },
  },
};
