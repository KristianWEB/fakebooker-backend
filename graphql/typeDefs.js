const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    hello: String!
    # user(id: String): User
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
    displayName: String!
  }

  type Error {
    message: String
  }

  type RegisterResponse {
    errors: [Error]
    user: User
  }

  type Mutation {
    register(registerInput: RegisterInput): RegisterResponse
  }
`;
