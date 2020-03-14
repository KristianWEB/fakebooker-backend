const mongoose = require("mongoose");

beforeAll(async done => {
  const clearDB = () => {
    Object.keys(mongoose.connection.collections).forEach(async key => {
      await mongoose.connection.collections[key].deleteMany({});
    });
    return done();
  };

  await mongoose.connect(
    "mongodb://localhost:27017/fakebooker",
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      return clearDB();
    }
  );
});

afterEach(async done => {
  mongoose.disconnect();
  return done();
});

afterAll(async done => {
  return done();
});
