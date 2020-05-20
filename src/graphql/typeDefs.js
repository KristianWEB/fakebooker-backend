const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String
    birthday: String
    avatarImage: String
    coverImage: String
    token: String
    username: String!
    workPlace: String
    school: String
    homePlace: String
    friends: [UserValue]
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    birthday: String!
    gender: String!
    password: String!
  }

  type UserValue {
    id: ID
    firstName: String
    lastName: String
    avatarImage: String
    username: String
  }

  type NotificationAction {
    id: ID!
    body: String!
  }

  type Notification {
    id: ID!
    creator: UserValue!
    notifier: UserValue!
    action: String!
    actionId: NotificationAction
    createdAt: String!
    status: String
  }

  type Message {
    id: ID!
    creator: UserValue!
    notifier: UserValue!
    body: String!
    createdAt: String!
    threadId: String!
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

  type Thread {
    id: ID!
    participantsIds: [ID]!
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

  type ConversationUser {
    _id: ID
    firstName: String
    lastName: String
    avatarImage: String
    username: String
  }

  type LatestMessage {
    _id: ID!
    creator: ConversationUser!
    notifier: ConversationUser!
    createdAt: String!
    body: String!
  }

  type Conversation {
    _id: ID!
    participantsIds: [ID]!
    latestMessage: LatestMessage!
    createdAt: String!
  }

  type Query {
    hello: String!
    loadUser: User!
    loadFromUrlUser(username: String!): User
    getUrlPosts(username: String!): [Post]
    getPosts: [Post]
    getUsers: [UserValue]
    getSinglePost(postId: String!): Post!
    getNotifications: [Notification]
    getSingleNotification(urlUser: String!): Notification
    getConversations: [Conversation]
    getSingleChat(threadId: String): [Message]
    getThread(urlUser: String): Thread
    getNewsfeed: [Post]
  }

  type Mutation {
    createNotification: Notification!
    deleteNotification: String!
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String, image: String): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): Comment!
    likePost(postId: ID!): Post
    addWorkplace(body: String!): User!
    changeAvatarImage(avatarImage: String!): User!
    changeCoverImage(coverImage: String!): User!
    deleteWorkplace: User!
    addSchool(body: String!): User!
    deleteSchool: User!
    addGender(gender: String!): User!
    deleteGender: User!
    addBirthday(birthday: String!): User!
    deleteBirthday: User!
    addHomeplace(homePlace: String!): User!
    deleteHomeplace: User!
    deleteImage(publicId: String!): String!
    addFriend(notifier: String!): Notification!
    acceptFriend(creator: String!): Notification!
    rejectFriend(creator: String!): String!
    removeFriend(creator: String!): User!
    createMessage(notifier: String!, body: String!, threadId: ID!): Message!
    createThread(urlUser: String!): Thread!
  }

  type Subscription {
    newNotification: Notification!
    deleteNotification: String!
    newMessage(notifierId: String!): Message
    newPost: Post!
  }
`;
