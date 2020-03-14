const faker = require("faker");
const User = require("../../src/models/User");
const Post = require("../../src/models/Post");
const Like = require("../../src/models/Like");
const Notification = require("../../src/models/Notification");

describe("Notification model", () => {
  // When User A likes on User B's post we have to store a notification model in DB
  test("should create a notification when User A likes User B's post", async () => {
    // Arrange
    const userA = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    const postA = await new Post({
      userId: userA._id,
      body: faker.lorem.sentence(),
    }).save();

    const userB = await new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      gender: faker.random.arrayElement(["male", "female"]),
    }).add();

    // Act
    // we are liking post A from user B and now we should create a notification which displays that action:
    await new Like({
      userId: userB._id,
      postId: postA._id,
    }).save();

    await new Notification({
      creator: userB._id,
      notifier: userA._id,
      action: "has liked your post",
      actionId: postA._id,
    }).save();

    const userANotifications = await Notification.findOne({
      notifier: userA._id,
    })
      .populate("creator", "firstName lastName avatarImage")
      .populate("notifier", "firstName lastName avatarImage")
      .populate("actionId", "body");

    const notificationMessage = `${userANotifications.creator.firstName} ${userANotifications.creator.lastName} ${userANotifications.action}: ${userANotifications.actionId.body}`;

    // expect the right user to be shown as the notification's creator
    expect(notificationMessage).toContain(
      `${userB.firstName} ${userB.lastName} ${userANotifications.action}: ${postA.body}`
    );

    // expect user A to be saved as notifier and user B as a creator in this case
    expect(userANotifications).toMatchObject({
      creator: {
        _id: userB._id,
        avatarImage: userB.avatarImage,
        firstName: userB.firstName,
        lastName: userB.lastName,
      },
      notifier: {
        _id: userA._id,
        avatarImage: userA.avatarImage,
        firstName: userA.firstName,
        lastName: userA.lastName,
      },
    });
  });

  // test("should create a notification when User A comments on User B's post", () => {});
});
