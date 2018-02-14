const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const axios = require('axios');
var convert = require('xml-js');


// Get goodreads book
router.get('/:search', (req, res) => {
    console.log('hi from book router', req.params.search);
    
    let url = 'https://www.goodreads.com/search/index.xml'
        let config = {
            params: {
                key: 'OHtX0PJH8qIwgMvihQfpxw',
                q: req.params.search,
                page: 1,
                search: 'all'
            } //end params
        } //end config

        //request to goodreads api
        axios.get(url, config)
            .then(function(response){
                let json = convert.xml2json(response.data, {compact: true, spaces: 4}) //converts xml response to json
                res.send(json); //sends json back to client            
            })
            .catch(function(error) {
                console.log('error', error);
                res.sendStatus(500);
            }) 
}); //end get request


//add new book to database
router.post('/', (req, res) => {
    console.log('in books router', req.body);
    let bookToAdd = req.body;
    // insert new book info in database
    const query = `INSERT INTO books (title, author, continent, cover_url, average_rating, year_published)
    VALUES ($1, $2, $3, $4, $5, $6)`
    pool.query(query, [bookToAdd.title, bookToAdd.author, bookToAdd.continent, bookToAdd.cover_url, bookToAdd.average_rating, bookToAdd.year_published])
        .then((result) => {
            console.log('result: ', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error: ', error);
            res.sendStatus(500);
        })
}); //end post

//get books by continent
router.get('/continent/:continent', (req, res) => {
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
    })

//get all books
router.get('/', (req, res) => {
    const query = 'SELECT * FROM books'
        pool.query(query)
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            console.log('error: ', error);
            
        })
})

//delete book by id
router.delete('/:bookId', (req, res) => {
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
})


 
module.exports = router;