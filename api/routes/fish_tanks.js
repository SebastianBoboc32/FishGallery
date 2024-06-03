const express = require('express');
const router = express.Router();
const mysql = require('mysql');

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
  const query = 'SELECT * FROM fishtanks';
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
  const newFishTankData = {
    TicketPrice: parseInt(req.body.TicketPrice),
    location: req.body.location,
    reviews: parseFloat(req.body.reviews)
  };
  const query = 'INSERT INTO fishtanks SET ?';
  db.query(query, newFishTankData, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(201).json({ message: "Fish tank added successfully", id: result.insertId });
    }
  });
});

router.put('/:tankId', (req, res) => {
  const tankId = req.params.tankId;
  const updatedFishTankData = {
    TicketPrice: parseInt(req.body.TicketPrice),
    location: req.body.location,
    reviews: parseFloat(req.body.reviews)
  };
  const query = 'UPDATE fishtanks SET ? WHERE tankId = ?';
  db.query(query, [updatedFishTankData, tankId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `Fish tank ${tankId} updated successfully` });
    }
  });
});

router.delete('/:tankId', (req, res) => {
  const tankId = req.params.tankId;
  const query = 'DELETE FROM fishtanks WHERE tankId = ?';
  db.query(query, tankId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(200).json({ message: `Deleted fish tank with ID ${tankId}` });
    }
  });
});

router.get('/:tankId', (req, res) => {
  const tankId = req.params.tankId;
  const query = 'SELECT * FROM fishtanks WHERE tankId = ?';
  db.query(query, tankId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: `Fish tank with ID ${tankId} not found` });
    } else {
      const fishTankData = result[0];
      const queryFish = 'SELECT COUNT(*) as fishCount FROM fish WHERE FishTankId = ?';
      db.query(queryFish, [tankId], (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
        } else {
          res.status(200).json({ ...fishTankData, fishCount: result[0].fishCount });
        }
      });
    }
  });
});

module.exports = router;