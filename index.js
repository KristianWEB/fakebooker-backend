const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
// Configure dotenv
require("dotenv").config();
const props = require("./config/properties");
// Express App
const app = require("./app");

// Port Number
const port = props.PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });
// Start Server
app.listen(port, () => {
  console.log(`http://localhost:${port}${server.graphqlPath}`);
});
