const testResolvers = require("./hello");
const usersResolvers = require("./users");
const postsResolvers = require("./posts");

module.exports = {
  Query: {
    ...testResolvers.Query,
    ...usersResolvers.Query,
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
