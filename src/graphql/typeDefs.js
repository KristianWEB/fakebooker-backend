const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    birthday: Date!
    avatarImage: String
    coverImage: String
    token: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    birthday: Date!
    gender: String!
    password: String!
  }

  type UserValue {
    firstName: String!
    lastName: String!
    avatarImage: String!
  }

  type NotificationAction {
    body: String!
  }

  type Notification {
    id: ID!
    creator: UserValue!
    notifier: UserValue!
    action: String!
    actionId: NotificationAction!
  }

  type Post {
    id: ID!
    userId: UserValue!
    body: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    userId: UserValue!
    postId: ID!
    body: String!
    createdAt: String!
  }

  type Like {
    userId: ID!
    postId: ID!
    createdAt: String!
  }

  type simpleComment {
    id: ID!
    userId: ID!
    postId: ID!
    body: String!
    createdAt: String!
  }
  type Query {
    hello: String!
    loadUser: User
    getPosts: [Post]
    getNotifications: [Notification]
  }

  type Mutation {
    createNotification: String!
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    # this is going to be refactored later ( when we create / delete comments we return the comments without populating => create a type that does that or simply dont require userValue to be returned )
    createComment(postId: ID!, body: String!): simpleComment!
    deleteComment(postId: ID!, commentId: ID!): simpleComment!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newComment: Comment!
    newLike: Like!
  }
`;
