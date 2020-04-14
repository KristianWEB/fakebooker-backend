require("dotenv").config();

module.exports = {
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/fakebooker",
  JWT_SECRET: process.env.JWT_SECRET || "YOURSECRET",
  PORT: process.env.PORT || 8080,
};
