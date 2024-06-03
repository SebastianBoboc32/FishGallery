const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Register user
exports.register = (req, res, next) => {
    const { name, email, password, confirmPassword,role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).send('All fields are required');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            return next(err);
        }

        const query = 'INSERT INTO users (Username, Email, Password,role) VALUES (?, ?, ?,?)';
        db.query(query, [name, email, hash,role], (dbErr, result) => {
            if (dbErr) {
                return next(dbErr);
            }
            res.status(201).json({message: 'User registered successfully'});
        });
    });
};
// Login user
exports.login = async (req, res) => {
    try {
        const userName = req.body.Username;
        const passwd = req.body.Password;

        const userResult = await new Promise((resolve, reject) => {
            db.query('SELECT Username, Password, ID, role FROM users WHERE Username = ?', [userName], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (userResult.length == 0) {
            return res.status(401).json({ message: "Username does not exist" });
        }

        const user = userResult[0];
        const passwordMatch = await bcrypt.compare(passwd, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect Password, try again" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.ID, username: user.Username, role: user.role }, // Include role in the token payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token, role: user.role }); // Include role in the response
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};