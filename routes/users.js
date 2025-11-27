// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    // Store hash in your password DB.
        if (err) {
            // Handle error
            return res.status(500).send('Error hashing password')
        }
        
        // Store hashed password in your database
        const query = 'INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?, ?, ?, ?, ?)'
        
        db.query(query, [
            req.body.username,
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            hashedPassword
        ], (err, result) => {
            if (err) {
                console.log('Database error: ', err);
                return res.status(500).send('Database error' + err.message);
            }
            let resultMessage = 'Hello ' + req.body.firstname + ' ' + req.body.lastname + ' you are now registered! We will send an email to you at ' + req.body.email
            resultMessage += '<br>Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword
            res.send(resultMessage) 
    });

        // Store hash in your password DB.                                                                            
}); 
});

router.get('/listusers', (req, res) => {
    const query = 'SELECT id, username, firstname, lastname, email, created_at FROM users'
    
    db.query(query, (err, result) => {
        if (err) {
            console.log('Database error:', err)
            return res.status(500).send('Error retrieving users')
        }
        res.render('listusers.ejs', { users: result })
    })
})

router.get('/login', (req, res) => {
    res.render('login.ejs')
})

// Handle login form submission
router.post('/loggedin', (req, res) => {
    // Get username from form
    const username = req.body.username
    
    // Query to find user by username
    const query = 'SELECT hashedPassword FROM users WHERE username = ?'
    
    db.query(query, [username], (err, result) => {
        if (err) {
            console.log('Database error:', err)
            return res.status(500).send('Database error')
        }
        
        // Check if user exists
        if (result.length === 0) {
            return res.send('Login failed: User not found')
        }
        
        // Get the hashed password from database
        const hashedPassword = result[0].hashedPassword
        
        // Compare the password supplied with the password in the database
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                console.log('Comparison error:', err)
                return res.status(500).send('Error during login')
            }
            else if (result == true) {
                // Passwords match - successful login
                res.send('Login successful! Welcome back, ' + username + '!')
            }
            else {
                // Passwords don't match
                res.send('Login failed: Incorrect password')
            }
        })
    })
})


// Export the router object so index.js can access it
module.exports = router
