const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    birthday: Int!
    avatarImage: String!
    coverImage: String!
    token: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    birthday: Int!
    gender: String!
    password: String!
  }

  type AuthorValue {
    username: String!
    coverImage: String!
  }
  type Post {
    id: ID!
    userId: String!
    author: AuthorValue!
    content: String!
    creationDate: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    userId: String!
    creationDate: String!
    author: AuthorValue!
    body: String!
  }

  type Like {
    id: ID!
    creationDate: String!
    username: String!
    coverImage: String!
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
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newComment: Comment!
    newLike: Like!
  }
`;
