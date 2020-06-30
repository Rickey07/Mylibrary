const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const checkAuth = require('../app');
router.get('/' , async ( req , res ) => {
    if(req.user == undefined) {
        req.user = []
    }
    let books
    try {
        books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec();
    } catch {
        books = []
    }
    res.render('index' , {books: books , userName: req.user.name})

})


module.exports = router;