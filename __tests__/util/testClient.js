const { ApolloServer } = require("apollo-server"); // Or `apollo-server-express`
const { createTestClient } = require("apollo-server-testing");

/**
 * Test client with custom context argument that can be set per query or mutate call
 * @param config Apollo Server config object
 * @param ctxArg Default argument object to be passed
 */
module.exports.testClient = (config, ctxArg) => {
  const baseCtxArg = ctxArg;
  let currentCtxArg = baseCtxArg;

  const { query, mutate, ...others } = createTestClient(
    new ApolloServer({
      ...config,
      context: () => config.context(currentCtxArg),
    })
  );

  // Wraps query and mutate function to set context arguments
  // eslint-disable-next-line no-shadow
  const wrap = fn => ({ ctxArg, ...args }) => {
    currentCtxArg = ctxArg != null ? ctxArg : baseCtxArg;
    return fn(args);
  };

  return { query: wrap(query), mutate: wrap(mutate), ...others };
};
