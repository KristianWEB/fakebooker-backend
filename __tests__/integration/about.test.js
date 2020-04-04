const { gql } = require("apollo-server");
const faker = require("faker");
const { testClient } = require("../util/testClient");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const ADD_WORKPLACE = gql`
  mutation addWorkplace($body: String!) {
    addWorkplace(body: $body) {
      workPlace
    }
  }
`;

const DELETE_WORKPLACE = gql`
  mutation {
    deleteWorkplace {
      workPlace
    }
  }
`;

describe("About integration testing", () => {
  test("Add workplace", async () => {
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

    // add workplace from authenticated user
    const newUser = await mutate({
      mutation: ADD_WORKPLACE,
      variables: {
        body: "Facebook",
      },
    });

    // ASSERT
    expect(newUser).toMatchSnapshot();
  });

  test("Delete workplace", async () => {
    // ARRANGE
    const authUser = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
      workPlace: faker.company.companyName(),
    }).add();

    const token = generateToken(authUser);

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

    // delete workplace from authenticated user
    const newUser = await mutate({
      mutation: DELETE_WORKPLACE,
    });

    // ASSERT
    expect(newUser).toMatchSnapshot();
  });
});
