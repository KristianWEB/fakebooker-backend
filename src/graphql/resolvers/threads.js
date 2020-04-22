const { AuthenticationError } = require("apollo-server");
const Thread = require("../../models/Thread");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {
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
