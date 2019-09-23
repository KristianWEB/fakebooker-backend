const express = require("express");

const app = express();
// Const path = require('path');
const volleyball = require("volleyball");
const cors = require("cors");
const passport = require("passport");
// Previous db connection
// const mongoose = require("mongoose");
// const config = require("./config/database");
const connectDB = require("./config/database");

// Connect Database
connectDB();

// Previous db connection
// // Connecting to database
// mongoose.connect(config.database, {
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useNewUrlParser: true,
// });

// // On database connection
// mongoose.connection.on("connected", () => {
//   console.log(`Connected to database ${config.database}`);
// });

// // On database error
// mongoose.connection.on("error", err => {
//   console.log(`Database error ${err}`);
// });

// HTTP logger & Express built-in middleware that does job of body-parser.
app.use(volleyball);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors Middleware
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));

app.get("/test", (req, res) => {
  res.send({ data: "hello from test endpoint" });
});

app.get("*", (req, res) => {
  res.send("Invalid Endpoint");
  res.end();
});

module.exports = app;
