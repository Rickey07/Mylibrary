const express = require('express');
const router = express.Router();
const Author = require('../models/author');


// Authors routes
router.get('/' , (req , res) =>  {
    res.render('authors/index')
} )

// New Author routes 
router.get('/new' , ( req , res ) => {
    res.render('authors/new' , { author: new Author() })
})

// for creating the authors 
router.post('/' , ( req , res ) => {
    res.send('create')
})

module.exports = router
