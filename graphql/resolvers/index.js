const helloResolver = require("./hello");

module.exports = {
  Query: {
    ...helloResolver.Query,
  },
};
