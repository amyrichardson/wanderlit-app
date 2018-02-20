const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const axios = require('axios');
var convert = require('xml-js');


// Get goodreads book
router.get('/:search', (req, res) => {
    console.log('hi from book router', req.params.search);

    //if the user has a current session and is an admin, complete the search
    if(req.isAuthenticated() && req.user.is_admin === true) {

        let url = 'https://www.goodreads.com/search/index.xml'
        let config = {
            params: {
                key: process.env.API_KEY,
                q: req.params.search,
                page: 1,
                search: 'all'
            } //end params
        } //end config
    
        //request to goodreads api
        axios.get(url, config)
            .then(function (response) {
                let json = convert.xml2json(response.data, {
                    compact: true,
                    spaces: 4
                }) //converts xml response to json
                res.send(json); //sends json back to client            
            })
            .catch(function (error) {
                console.log('error', error);
                res.sendStatus(500);
            })
            
    //if user is not authenticated or is not an admin, send a 403 error
    } else {
        res.sendStatus(403);
    }
}); //end get request


//add new book to database
router.post('/', (req, res) => {
    console.log('in books router', req.body);

    //make sure user is an admin with current session
    if(req.isAuthenticated() && req.user.is_admin === true) {

        let bookToAdd = req.body;
        // insert new book info in database
        const query = `INSERT INTO books (title, author, continent, cover_url, average_rating, year_published, description, goodreads_id, ratings_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
        pool.query(query, [bookToAdd.title, bookToAdd.author, bookToAdd.continent, bookToAdd.cover_url, bookToAdd.average_rating, bookToAdd.year_published, bookToAdd.description, bookToAdd.goodreadsId, bookToAdd.ratings_count])
            .then((result) => {
                console.log('result: ', result);
                res.sendStatus(200);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.sendStatus(500);
            })
    //send back a 403 if not an admin with current session
    } else {
        res.sendStatus(403);
    }
    
}); //end post

//get books by continent
router.get('/continent/:continent', (req, res) => {
    if(req.isAuthenticated()) {

        console.log('in books router', req.params);
        const query = 'SELECT * FROM books WHERE continent = $1'
        pool.query(query, [req.params.continent])
            .then((result) => {
                console.log('result: ', result);
                res.send(result)
            })
            .catch((error) => {
                console.log('error: ', error);
    
            })

    } else {
        res.sendStatus(403);
    }
})

//get all books
router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        const query = 'SELECT * FROM books'
        pool.query(query)
            .then((result) => {
                res.send(result)
            })
            .catch((error) => {
                console.log('error: ', error);
    
            })
    } else {
        res.sendStatus(403);
    }
    
})

//delete book by id
router.delete('/:bookId', (req, res) => {
    //only an admin can delete books from database
    if(req.isAuthenticated() && req.user.is_admin === true) {
        const query = 'DELETE FROM users_books WHERE book_id = $1'
        pool.query(query, [req.params.bookId])
            .then((result) => {
                const query = 'DELETE FROM books WHERE id = $1'
                pool.query(query, [req.params.bookId])
                    .then((result) => {
                        res.sendStatus(200);
                    })
            })
            .catch((error) => {
                res.sendStatus(500);
            })

    } else {
        res.sendStatus(403);
    }
})

router.get('/view/:id', (req, res) => {
    if(req.isAuthenticated()) {
        console.log('in router with: ', req.params.id);
        const query = 'SELECT * FROM books WHERE id = $1'
        pool.query(query, [req.params.id])
            .then((result) => {
                res.send(result.rows[0])
            })
            .catch((error) => {
                res.sendStatus(500);
            })
    } else {
        res.sendStatus(403);
    }
})

router.put('/review', (req, res) => {
    console.log('in router with: ', req.body);
    const query = 'UPDATE users_books SET rating = $1, review = $2 WHERE book_id = $3 AND user_id = $4'
    pool.query(query, [req.body.rating, req.body.review, req.body.book_id, req.user.id])
        .then((result) => {
            console.log('success:', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error: ', error);
            res.sendStatus(500);
        })
})

//get reviews for one book
router.get('/review/:id', (req, res) => {
    console.log('in router with:', req.params.id);
    const query = 'SELECT rating, review, username FROM users_books JOIN users ON users_books.user_id = users.id WHERE book_id = $1'
    pool.query(query, [req.params.id])
        .then((result) => {
            console.log('query result:', result);
            res.send(result.rows);
            
        })
        .catch((error) => {
            console.log('error:', error);
            res.sendStatus(500);
        })

})


module.exports = router;