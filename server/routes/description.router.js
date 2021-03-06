const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const axios = require('axios');
var textVersion = require('textversionjs')
var convert = require('xml-js');

router.get('/:bookId', (req,res) => {
    if(req.isAuthenticated()) {
        axios.get(`https://www.goodreads.com/book/show/${req.params.bookId}.xml?key=${process.env.API_KEY}`).then(function(response) {
            let json = convert.xml2json(response.data, {compact: true, spaces: 4}) //converts xml response to json
            res.send(json); //sends json back to client            
        })
        .catch(function(error) {
            console.log('error book description: ', error);
            res.sendStatus(500);
        })

    } else {
        res.sendStatus(403);
    }
})


module.exports = router;