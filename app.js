require("dotenv").config();
const express = require("express");

const app = express();
// Const path = require('path');
const volleyball = require("volleyball");
const cors = require("cors");

const connectDB = require("./config/database");

// Connect Database
connectDB();

// HTTP logger & Express built-in middleware that does job of body-parser.
app.use(volleyball);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors Middleware
app.use(cors());

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
