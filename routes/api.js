const express = require('express')
const router = express.Router()

// API route to get all books with optional search, price filter, and sorting
router.get('/books', function (req, res, next) {
    
    let sqlquery = "SELECT * FROM books WHERE 1=1"
    let params = []
    
    // Add search filter 
    if (req.query.search) {
        sqlquery += " AND name LIKE ?"
        params.push('%' + req.query.search + '%')
    }
    
    // Add minimum price filter 
    if (req.query.minprice) {
        sqlquery += " AND price >= ?"
        params.push(parseFloat(req.query.minprice))
    }
    
    // Add maximum price filter 
    if (req.query.maxprice || req.query.max_price) {
        sqlquery += " AND price <= ?"
        // Support both maxprice and max_price parameter names
        params.push(parseFloat(req.query.maxprice || req.query.max_price))
    }
    
    // Add sorting
    if (req.query.sort) {
        // Whitelist allowed sort columns to prevent SQL injection
        const allowedSorts = ['name', 'price']
        const sortColumn = req.query.sort.toLowerCase()
        
        if (allowedSorts.includes(sortColumn)) {
            sqlquery += " ORDER BY " + sortColumn
        }
    }
    
    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router