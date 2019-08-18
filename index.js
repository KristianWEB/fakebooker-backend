// Configure dotenv
require('dotenv').config();
// Express App
const app = require('./app');

// Port Number
const port = process.env.PORT || 8080;

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
