const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    hello: String!
    # query user?
    # getUser(id: String): User
  }

  type statusValue {
    isDeactivated: Boolean
    lastActiveDate: Int
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
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
  }
`;
