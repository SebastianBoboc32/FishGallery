const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect(error => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Database connected.');
  }
});

router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    });
});

router.post('/', (req, res) => {
  const newUserData = {
    Username: req.body.Username,
    Email: req.body.Email,
    Password: req.body.Password,
    role: req.body.role
  };
  const query = 'INSERT INTO users SET ?';
  db.query(query, newUserData, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(201).json({ message: "User added successfully", id: result.insertId });
    }
  });
});

router.put('/:ID', (req, res) => {
  const userId = req.params.ID;
  const updatedUserData = {
    Username: req.body.Username,
    Email: req.body.Email,
    Password: req.body.Password,
    role: req.body.role
  };
  const query = 'UPDATE users SET ? WHERE ID = ?';
  db.query(query, [updatedUserData, userId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `User ${userId} updated successfully` });
    }
  });
});

router.delete('/:ID', (req, res) => {
  const userId = req.params.ID;
  const query = 'DELETE FROM users WHERE ID = ?';
  db.query(query, userId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `Deleted user with ID ${userId}` });
    }
  });
});

router.get('/:ID', (req, res) => {
  const userId = req.params.ID;
  const query = 'SELECT * FROM users WHERE ID = ?';
  db.query(query, userId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: `User with ID ${userId} not found` });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

module.exports = router;
