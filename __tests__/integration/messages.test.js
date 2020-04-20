const { gql } = require("apollo-server");
const faker = require("faker");
const { testClient } = require("../util/testClient");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const CREATE_MESSAGE = gql`
  mutation createMessage($notifier: String!, $body: String!) {
    createMessage(notifier: $notifier, body: $body) {
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
      body
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  {
    getMessages {
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
      body
      createdAt
    }
  }
`;

describe("Chat system integration testing", () => {
  test("User A and User B: User A should be able to message User B", async () => {
    // ARRANGE
    const userA = await new User({
      firstName: "John",
      lastName: "Doe",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const userB = await new User({
      firstName: "Jack",
      lastName: "Daniels",
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(userA);

    // ACT
    // use the test server to create a query function
    const { query, mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${token}` } },
      }
    );

    // create a message from authenticated user ( user A )
    const message = await mutate({
      mutation: CREATE_MESSAGE,
      variables: {
        notifier: userB.id,
        body: "how are you buddy?",
      },
    });

    // assert that createMessage mutation returns the proper data
    expect(message).toMatchObject({
      data: {
        createMessage: {
          creator: {
            firstName: userA.firstName,
            lastName: userA.lastName,
          },
          notifier: {
            firstName: userB.firstName,
            lastName: userB.lastName,
          },
          body: "how are you buddy?",
        },
      },
    });

    // get messages for the notifier ( in this case authenticated user: User B) and assert that there is a new message from user B
    const tokenB = generateToken(userB);

    const messages = await query({
      mutation: GET_MESSAGES,
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });
    expect(messages).toMatchSnapshot();
  });

  // Subscriptions cannot be tested as apollo-server-testing is not allowing it yet.
});
