const mongoose = require("mongoose");
// Import config package and get db URI from default.json
const config = require("config");

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process on failure
    process.exit(1);
  }
};

module.exports = connectDB;

// Previous db connection
// const databaseURL =
//   process.env.DB_URL || "mongodb://localhost:27017/sidekickdb";

// module.exports = {
//   database: databaseURL,
//   // Needed for passportjs
//   secret: "yoursecret",
// };
