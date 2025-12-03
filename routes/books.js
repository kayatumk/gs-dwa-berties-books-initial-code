// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
         });
    });

router.get('/addbook',function(req, res, next){
    res.render('addbook.ejs')
});

router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 

router.get('/weather',  function(req, res, next) {
    // Weather route code will go here
    let apiKey = process.env.WEATHER_API_KEY
    let city = req.query.city || 'london'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                     
    request(url, function (err, response, body) {
        if(err){
            res.render('weather.ejs', { error: 'Error fetching weather data' })
        } else {
            let weatherData = JSON.parse(body)

            if (weatherData.cod == 200) {
            // Success - render with weather data
                res.render('weather.ejs', { weather: weatherData })
            } else {
                // City not found or API error
                res.render('weather.ejs', { error: 'City not found. Please try again.' })
            }

          } 
        });
});


// Export the router object so index.js can access it
module.exports = router
