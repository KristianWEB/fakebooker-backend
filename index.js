const { ApolloServer } = require("apollo-server");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
// Configure dotenv
require("dotenv").config();

const connectDB = require("./config/database");
// Connect Database
connectDB();

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: async ({ req }) => ({ req }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
