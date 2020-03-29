const { gql } = require("apollo-server");
const faker = require("faker");
const { testClient } = require("../util/testClient");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
    }
  }
`;

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
    }
  }
`;

const GET_NOTIFICATIONS = gql`
  {
    getNotifications {
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
  test("should not create a notification if the creator and the notifier are the same user ( liking )", async () => {
    // ARRANGE
    const authUser = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(authUser);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );

    // create a post from authenticated user
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: faker.lorem.sentence(),
      },
      ctxArg: { req: { headers: { authorization: `JWT ${token}` } } },
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
    // a notification created from you for yourself is not needed. expect a blank array if you are liking your post
    expect(notifications).toMatchSnapshot();
  });

  test("should create a notification if the creator and the notifier are different users ( liking )", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Devon",
      lastName: "Orn",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Brady",
      lastName: "Yost",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const tokenA = generateToken(userA);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      { req: { headers: { authorization: `JWT ${tokenA}` } } }
    );

    // create a post from authenticated user ( user A )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: "example post",
      },
    });

    // like a post from other user ( user B ) ?? HOW
    const tokenB = generateToken(userB);

    await mutate({
      mutation: LIKE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // fetch notifications for authenticated user
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    // ASSERT
    expect(notifications).toMatchSnapshot();
  });

  test("should not create a notification if the creator and the notifier are the same user ( commenting )", async () => {
    // ARRANGE
    const authUser = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(authUser);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );

    // create a post from authenticated user
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: faker.lorem.sentence(),
      },
      ctxArg: { req: { headers: { authorization: `JWT ${token}` } } },
    });

    // comment a post from authenticated user
    await mutate({
      mutation: CREATE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        body: "example comment",
      },
    });

    // fetch notifications for authenticated user
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    // ASSERT
    // a notification created from you for yourself is not needed. expect a blank array if you are commenting your post
    expect(notifications).toMatchSnapshot();
  });

  test("should create a notification if the creator and the notifier are different users ( commenting )", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Devon",
      lastName: "Orn",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Brady",
      lastName: "Yost",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const tokenA = generateToken(userA);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      { req: { headers: { authorization: `JWT ${tokenA}` } } }
    );

    // create a post from authenticated user ( user A )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: "example post",
      },
    });

    // like a post from other user ( user B ) ?? HOW
    const tokenB = generateToken(userB);

    await mutate({
      mutation: CREATE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        body: "example comment",
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // fetch notifications for authenticated user
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    // ASSERT
    expect(notifications).toMatchSnapshot();
  });

  test("should delete a notification if the creator unlikes", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Devon",
      lastName: "Orn",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Brady",
      lastName: "Yost",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const tokenA = generateToken(userA);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      { req: { headers: { authorization: `JWT ${tokenA}` } } }
    );

    // create a post from authenticated user ( user A )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: "example post",
      },
    });

    // like a post from other user ( user B ) ?? HOW
    const tokenB = generateToken(userB);

    await mutate({
      mutation: LIKE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // unlike the post
    await mutate({
      mutation: LIKE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // user B is unliking the post => delete the created notification
    expect(
      await query({
        query: GET_NOTIFICATIONS,
      })
    ).toMatchSnapshot();
  });

  test("should delete a notification if the creator deletes his comment", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Devon",
      lastName: "Orn",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Brady",
      lastName: "Yost",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const tokenA = generateToken(userA);

    // ACT
    // use the test server to create a query function
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      { req: { headers: { authorization: `JWT ${tokenA}` } } }
    );

    // create a post from authenticated user ( user A )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body: "example post",
      },
    });

    // comment a post from other user ( user B )
    const tokenB = generateToken(userB);

    const createComment = await mutate({
      mutation: CREATE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        body: "example comment",
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // delete the comment
    await mutate({
      mutation: DELETE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        commentId: createComment.data.createComment.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // user B is uncommenting the post => delete the created notification
    const notifications = await query({
      query: GET_NOTIFICATIONS,
    });

    expect(notifications).toMatchSnapshot();
  });
});
