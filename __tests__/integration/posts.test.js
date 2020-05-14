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
      id
      body
      image
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      postId
      id
      body
      createdAt
    }
  }
`;

const SHARE_POST = gql`
  mutation sharePost($postId: String!) {
    sharePost(postId: $postId) {
      id
      body
      shares {
        userId
        postId
        createdAt
      }
      image
    }
  }
`;

const GET_POSTS = gql`
  {
    getPosts {
      body
      shares {
        userId
        createdAt
      }
      image
      likes {
        userId
        postId
        createdAt
      }
      comments {
        body
        userId {
          firstName
          lastName
        }
        createdAt
      }
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

    expect(post).toMatchObject({
      data: {
        createPost: {
          body,
          image,
        },
      },
    });
  });

  test("user A should be able to share user B's post", async () => {
    const body = "Example post";

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

    // ACT ( from userA )
    const { mutate } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${tokenA}` } },
      }
    );

    // create a post from authenticated user
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body,
      },
    });

    const tokenB = generateToken(userB);

    // share userA's post from userB
    const sharedPost = await mutate({
      mutation: SHARE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    expect(sharedPost).toMatchObject({
      data: {
        sharePost: {
          shares: [
            {
              userId: userB.id,
              postId: post.data.createPost.id,
            },
          ],
        },
      },
    });
  });
  test.only("user A should be able to share and then unshare user B's post by deleting the newly shared post", async () => {
    const body = "Example post";

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

    // ACT ( from userA )
    const { mutate, query } = testClient(
      {
        resolvers,
        typeDefs,
        context: async ({ req }) => ({ req }),
      },
      {
        req: { headers: { authorization: `JWT ${tokenA}` } },
      }
    );

    // create a post from authenticated user
    const post = await mutate({
      mutation: CREATE_POST,
      variables: {
        body,
      },
    });

    const tokenB = generateToken(userB);

    // share userA's post from userB
    await mutate({
      mutation: SHARE_POST,
      variables: {
        postId: post.data.createPost.id,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    await mutate({
      mutation: CREATE_POST,
      variables: {
        body,
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    await mutate({
      mutation: CREATE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        body: "this is a new comment",
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });
    await mutate({
      mutation: CREATE_COMMENT,
      variables: {
        postId: post.data.createPost.id,
        body: "another comment",
      },
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });

    const getPostsUserB = await query({
      query: GET_POSTS,
      ctxArg: { req: { headers: { authorization: `JWT ${tokenB}` } } },
    });
    console.log(getPostsUserB.data.getPosts);

    // expect(sharedPost).toMatchObject({
    //   data: {
    //     sharePost: {
    //       shares: [
    //         {
    //           userId: userB.id,
    //         },
    //       ],
    //     },
    //   },
    // });
  });
});
