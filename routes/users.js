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


// Export the router object so index.js can access it
module.exports = router
