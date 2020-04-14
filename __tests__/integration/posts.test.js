const { gql } = require("apollo-server");
const faker = require("faker");
const { testClient } = require("../util/testClient");
const typeDefs = require("../../src/graphql/typeDefs");
const resolvers = require("../../src/graphql/resolvers/index");
const User = require("../../src/models/User");
const generateToken = require("../../src/util/generateToken");

const CREATE_POST = gql`
  mutation createPost($body: String!, $image: String) {
    createPost(body: $body, image: $image) {
      body
      image
    }
  }
`;

describe("Posts integration testing", () => {
  test("should insert an image url in Post model if its provided in the mutation", async () => {
    // ARRANGE
    const image =
      "https://images.unsplash.com/photo-1551641145-a1e18544acb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=697&q=80";

    const body = "Example post";

    const authUser = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const token = generateToken(authUser);

    // ACT
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

    // create a post from authenticated user ( with image included )
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body,
        image,
      },
    });

    // ASSERT
    expect(post).toMatchSnapshot();
  });
});
