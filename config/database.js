const databaseURL = process.env.DB_URL || 'mongodb://localhost:27017/sidekickdb';

module.exports = {
  database: databaseURL,
  // Needed for passportjs
  secret: 'yoursecret',
};
