const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    hello: String!
  }

  type statusValue {
    isDeactivated: Boolean
    lastActiveDate: String
  }

  type User {
    username: String!
    token: String!
    email: String!
    displayName: String
    coverImage: String
    status: statusValue
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
  }
`;
