const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String
    birthday: Date
    avatarImage: String
    coverImage: String
    token: String
    username: String!
    workPlace: String
    school: String
    homePlace: String
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
    id: ID
    firstName: String
    lastName: String
    avatarImage: String
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
    createdAt: Date!
  }

  type deletedNotification {
    id: ID!
  }

  type Post {
    id: ID!
    userId: UserValue!
    body: String!
    image: String
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
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
    loadUser(loadFromDB: Boolean): User
    loadUserFromDB: User
    loadFromUrlUser(username: String!): User
    getUrlPosts(username: String!): [Post]
    getPosts: [Post]
    getNotifications: [Notification]
  }

  type Mutation {
    createNotification: String!
    deleteNotification: String!
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!, image: String): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): Comment!
    likePost(postId: ID!): Post
    addWorkplace(body: String!): User!
    deleteWorkplace: User!
    addSchool(body: String!): User!
    deleteSchool: User!
    addGender(gender: String!): User!
    deleteGender: User!
    addBirthday(birthday: Date!): User!
    deleteBirthday: User!
    addHomeplace(homePlace: String!): User!
    deleteHomeplace: User!
    deleteImage(publicId: String!): String!
  }

  type Subscription {
    newNotification: Notification!
    deleteNotification: String!
  }
`;
