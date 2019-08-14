const express = require('express');
const app = express();
// const path = require('path');
const volleyball = require('volleyball');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connecting to database
mongoose.connect(config.database,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

// On database connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// On database error
mongoose.connection.on('error', err => {
  console.log('Database error ' + err);
});

// HTTP logger & Express built-in middleware that does job of body-parser.
app.use(volleyball);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Port Number
const port = process.env.PORT || 8080;

// Cors Middleware
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.get('/test', (req, res) => {
  res.send({ data: 'hello from test endpoint' });
});

app.get('*', (req, res) => {
  res.send('Invalid Endpoint');
  res.end();
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port ' + port);
});