const { gql } = require("apollo-server");
const faker = require("faker");
const { testClient } = require("../util/testClient");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const ADD_FRIEND = gql`
  mutation addFriend($notifier: String!) {
    addFriend(notifier: $notifier) {
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
      status
    }
  }
`;

const ACCEPT_FRIEND = gql`
  mutation acceptFriend($creator: String!) {
    acceptFriend(creator: $creator) {
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
      status
    }
  }
`;

const REJECT_FRIEND = gql`
  mutation rejectFriend($creator: String!) {
    rejectFriend(creator: $creator)
  }
`;

const REMOVE_FRIEND = gql`
  mutation removeFriend($creator: String!) {
    removeFriend(creator: $creator) {
      id
      friends {
        id
        firstName
        lastName
        avatarImage
        username
      }
    }
  }
`;

describe("Friends integration testing", () => {
  test("should create a notification with status: pending if User A sends a friend request to User B", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Vincent",
      lastName: "Beahan",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Emil",
      lastName: "Reinger",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);
    // ACT
    // use the test server to create a query function
    const { mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );
    // send a friend request from userA to userB
    const notification = await mutate({
      mutation: ADD_FRIEND,
      variables: {
        notifier: userB.username,
      },
    });

    // ASSERT
    expect(notification).toMatchObject({
      data: {
        addFriend: {
          status: "pending",
          creator: {
            firstName: userA.firstName,
            lastName: userA.lastName,
          },
          notifier: {
            firstName: userB.firstName,
            lastName: userB.lastName,
          },
        },
      },
    });
    expect(notification).toMatchSnapshot();
  });
  test("User A sends a friend request to User B => if User B accepts add User A to User B's friends array", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Vincent",
      lastName: "Beahan",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Emil",
      lastName: "Reinger",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);
    // ACT
    // use the test server to create a query function
    const { mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );
    // send a friend request from userA to userB
    await mutate({
      mutation: ADD_FRIEND,
      variables: {
        notifier: userB.username,
      },
    });

    const tokenB = generateToken(userB);

    // accept the friend request from userB
    const acceptNotification = await mutate({
      mutation: ACCEPT_FRIEND,
      variables: {
        creator: userA.username,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });
    expect(acceptNotification).toMatchSnapshot();

    // ASSERT
    expect(acceptNotification).toMatchObject({
      data: {
        acceptFriend: {
          status: "accepted",
          creator: {
            firstName: userA.firstName,
            lastName: userA.lastName,
          },
          notifier: {
            firstName: userB.firstName,
            lastName: userB.lastName,
          },
        },
      },
    });
    // assert that user B and user A have their ids in each one's friends array
    const newUserA = await User.findById(userA.id);
    const newUserB = await User.findById(userB.id);

    expect(newUserA.friends[0].toString()).toEqual(newUserB.id);
    expect(newUserB.friends[0].toString()).toEqual(newUserA.id);
  });
  test("User A sends a friend request to User B => if User B rejects then remove the friend notification", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Vincent",
      lastName: "Beahan",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Emil",
      lastName: "Reinger",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);
    // ACT
    // use the test server to create a query function
    const { mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );
    // send a friend request from userA to userB
    await mutate({
      mutation: ADD_FRIEND,
      variables: {
        notifier: userB.username,
      },
    });

    const tokenB = generateToken(userB);

    // reject the friend request from userB
    await mutate({
      mutation: REJECT_FRIEND,
      variables: {
        creator: userA.username,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // assert that user B and user A do NOT have their ids in each one's friends array
    const newUserA = await User.findById(userA.id);
    const newUserB = await User.findById(userB.id);

    expect(newUserA.friends[0]).toBeUndefined();
    expect(newUserB.friends[0]).toBeUndefined();
  });
  test("User A is friends with User B => if User B removes User A from his friendlist then remove each ids from each user's friends array", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "Vincent",
      lastName: "Beahan",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Emil",
      lastName: "Reinger",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);
    // ACT
    // use the test server to create a query function
    const { mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );
    // send a friend request from userA to userB
    await mutate(
      {
        mutation: ADD_FRIEND,
        variables: {
          notifier: userB.username,
        },
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );

    const tokenB = generateToken(userB);

    // accept the friend request from userB
    await mutate({
      mutation: ACCEPT_FRIEND,
      variables: {
        creator: userA.username,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // remove the friend ( User A ) from userB
    await mutate({
      mutation: REMOVE_FRIEND,
      variables: {
        creator: userA.username,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    // assert that user B and user A do NOT have their ids in each one's friends array
    const newUserA = await User.findById(userA.id);
    const newUserB = await User.findById(userB.id);

    expect(newUserA.friends[0]).toBeUndefined();
    expect(newUserB.friends[0]).toBeUndefined();
  });
});
