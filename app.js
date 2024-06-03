const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const fishRoutes = require('./api/routes/fish');
const tankRoutes = require('./api/routes/fish_tanks');
const authRoutes = require('./api/routes/auth');
const userRoutes = require('./api/routes/users');

const app = express();

// Database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Database connection successful");
  }
});

// Middleware setup
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Route handlers
app.use('/auth', authRoutes);
app.use('/fish', fishRoutes);
app.use('/fish_tanks', tankRoutes);
app.use('/users',userRoutes);

// Error handling for 404
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// General error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;