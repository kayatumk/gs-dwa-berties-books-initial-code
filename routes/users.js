const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Display registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle form submission
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

    // Use the global db connection
    db.query(sql, [username, password, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.redirect('/users/registered');
    });
});

// Confirmation page
router.get('/registered', (req, res) => {
    res.render('registered');
});

module.exports = router;
