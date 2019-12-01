const { gql } = require("apollo-server-express");

module.exports = gql`
  type statusValue {
    isDeactivated: Boolean
    lastActiveDate: String
  }

  type User {
    id: ID
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

  # type PostValue {
  #   # right now this is returning the whole user with the token which isn't really cool so this is going to be refactored in the future!!
  #   # posts: [Post]!
  #   # author: User!
  # }

  type AuthorValue {
    username: String!
    coverImage: String!
  }
  type Post {
    id: ID!
    user: String!
    author: AuthorValue!
    content: String!
    creationDate: String!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Query {
    hello: String!
    loadUser: User
    getPosts(username: String!): [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(content: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
  }
`;
