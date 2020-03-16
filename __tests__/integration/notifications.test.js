const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const faker = require("faker");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      userId {
        firstName
        lastName
        avatarImage
      }
      body
      createdAt
    }
  }
`;

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        userId
        postId
        createdAt
      }
      likeCount
    }
  }
`;

const GET_NOTIFICATIONS = gql`
  {
    getNotifications {
      id
      creator {
        firstName
        lastName
        avatarImage
      }
      notifier {
        firstName
        lastName
        avatarImage
      }
      action
      actionId {
        body
      }
    }
  }
`;

describe("Notifications integration testing", () => {
  test("should not create a notification if the creator and the notifier are the same user ( authenticated )", async () => {
    // ARRANGE
    const authUser = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(authUser);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        req: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }),
    });

    // ACT
    // use the test server to create a query function
    const { mutate, query } = createTestClient(server);

    // create a post from authenticated user
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: faker.lorem.sentence(),
      },
    });

    // like a post from authenticated user
    await mutate({
      mutation: LIKE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
    });

    // fetch notifications for authenticated user
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    // ASSERT
    // a notification created from your for yourself is not needed. expect a blank array if you are liking your post
    expect(notifications).toMatchSnapshot();
  });

  test("should create a notification if the creator and the notifier are different users ( liking )", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        req: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }),
    });

    // ACT
    // use the test server to create a query function
    const { mutate, query } = createTestClient(server);

    // create a post from authenticated user ( user A )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: faker.lorem.sentence(),
      },
    });

    // like a post from other user ( user B ) ?? HOW
    await mutate({
      mutation: LIKE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
    });

    // fetch notifications for authenticated user
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    // ASSERT
    expect(notifications).toMatchSnapshot();
  });

  // should create a notification if the creator and the notifier are different users that are commenting on the post

  // should delete a notification if the creator unlikes

  // should delete a notification if the creator deletes his comment
});
