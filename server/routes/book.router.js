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
            }
        }

        axios.get(url, config).then(function(response){
            let json = convert.xml2json(response.data, {compact: true, spaces: 4})
            res.send(json);            
        })
        .catch(function(error) {
            console.log('error', error);
            res.sendStatus(500);
        })

});

module.exports = router;