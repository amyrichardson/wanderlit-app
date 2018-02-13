const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

//add a book to user's lists
router.post('/:userId', (req,res) => {
    console.log('in post with: ', req.body, req.params);
    const query = 'INSERT INTO users_books (user_id, book_id, status) VALUES ($1, $2, $3)'
    pool.query(query, [req.params.userId, req.body.id, req.body.status])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error adding book to list: ', error);
            res.sendStatus(500);
        })
})

//get users lists
router.get('/:userId', (req,res) => {
    console.log('in get user lists', req.params.userId);
    let userLists = {
        to_read: [],
        currently_reading: [],
        previously_read: []
    }
    //select books that current user has added to 'to read' list
    const queryToRead = `SELECT * FROM books JOIN users_books ON users_books.book_id = books.id WHERE user_id = $1 AND status = 'to_read'`
    pool.query(queryToRead, [req.params.userId])
        .then((result) => {
            //add books to the userLists object
            userLists.to_read = result.rows;

            //select books that current user has added to 'previously read' list
            const queryPreviouslyRead = `SELECT * FROM books JOIN users_books ON users_books.book_id = books.id WHERE user_id = $1 AND status = 'previously_read'`
            pool.query(queryPreviouslyRead, [req.params.userId])
                .then((result) => {
                    //add books to the userLists object
                    userLists.previously_read = result.rows;

                    //select books that current user has added to 'currently reading' list
                    const queryCurrentlyReading = `SELECT * FROM books JOIN users_books ON users_books.book_id = books.id WHERE user_id = $1 AND status = 'currently_reading'`
                    pool.query(queryCurrentlyReading, [req.params.userId])
                        .then((result) => {
                            //add books to the userLists object
                            userLists.currently_reading = result.rows;

                            //send object back to client
                            res.send(userLists);
                        }) //end currently reading query 
                }) //end previously read query
        }) //end to read query
        .catch((error) => {
            //if any queries above fail, send status of 500
            res.sendStatus(500);
        })
})

module.exports = router;