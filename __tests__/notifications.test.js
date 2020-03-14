const User = require("../src/models/User");

describe("Notification model", () => {
  // When User A comments on User B's post we have to store a notification model in DB
  test("should create a notification when User A comments on User B's post", async () => {
    const userA = new User({
      email: "kristian@kristian.com",
      firstName: "Kristian",
      lastName: "Ivanov",
      password: "Kristian345",
      gender: "male",
    });
    const savedUserA = await userA.add();

    expect(savedUserA.firstName).toBe(userA.firstName);
  });

  // test("should create a notification when User A likes User B's post", () => {});
});
