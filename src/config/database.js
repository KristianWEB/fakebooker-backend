const mongoose = require("mongoose");
const props = require("./properties");

const db = props.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process on failure
    process.exit(1);
  }
};

module.exports = connectDB;
