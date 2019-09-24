// Configure dotenv
require("dotenv").config();
const props = require("./config/properties");
// Express App
const app = require("./app");

// Port Number
const port = props.PORT;

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
