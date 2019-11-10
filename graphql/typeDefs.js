const { gql } = require("apollo-server-express");

module.exports = gql`
  type statusValue {
    isDeactivated: Boolean
    lastActiveDate: String
  }

  type User {
    username: String!
    token: String!
    email: String!
    displayName: String!
    coverImage: String!
    status: statusValue!
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Post {
    id: ID!
    content: String!
    username: String!
    creationDate: String!
  }
  type Query {
    hello: String!
    loadUser: User
    getPost(username: String!): [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
  }
`;
