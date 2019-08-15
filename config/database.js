// Rename this file as database.js

const databaseURL =
  process.env.DB_URL || "mongodb://localhost:27017/sidekickdb";

module.exports = {
  database: databaseURL,
  secret: "yoursecret" // needed for passportjs
};
