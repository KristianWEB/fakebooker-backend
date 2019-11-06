const usersResolvers = require("./users");
const testResolvers = require("./hello");

module.exports = {
  Query: {
    ...testResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
