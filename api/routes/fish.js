const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

// Ensure the database connection is established
db.connect(error => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Database connected.');
  }
});

router.get('/', (req, res) => {
  const query = 'SELECT * FROM fish';
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
  const newFishData = {
    name: req.body.name,
    species: req.body.species,
    origin: req.body.origin,
    beauty_score: parseFloat(req.body.beauty_score),
    FishTankId: req.body.FishTankId || 0
  };
  const query = 'INSERT INTO fish SET ?';
  db.query(query, newFishData, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(201).json({ message: "Fish added successfully", id: result.insertId });
    }
  });
});

router.put('/:fishId', (req, res) => {
  const fishId = req.params.fishId;
  const updatedFishData = {
    name: req.body.name,
    species: req.body.species,
    origin: req.body.origin,
    beauty_score: parseFloat(req.body.beauty_score)
  };
  const query = 'UPDATE fish SET ? WHERE fishId = ?';
  db.query(query, [updatedFishData, fishId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `Fish ${fishId} updated successfully` });
    }
  });
});

router.delete('/:fishId', (req, res) => {
  const fishId = req.params.fishId;
  const query = 'DELETE FROM fish WHERE fishId = ?';
  db.query(query, fishId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `Deleted fish with ID ${fishId}` });
    }
  });
});

router.get('/:fishId', (req, res) => {
  const fishId = req.params.fishId;
  const query = 'SELECT * FROM fish WHERE fishId = ?';
  db.query(query, fishId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: `Fish with ID ${fishId} not found` });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

module.exports = router;