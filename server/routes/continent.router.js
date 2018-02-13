const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('in continents router get');
    const query = 'SELECT * FROM continents'
    pool.query(query)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
            console.log('error on continents get', error);
            res.sendStatus(500);
        })
})


module.exports = router;