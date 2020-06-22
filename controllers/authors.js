const express = require('express');
const router = express.Router();
const Author = require('../models/author');


// Authors routes
router.get('/' , async (req , res) =>  {
    try {
        const authors = await Author.find({});
        res.render('authors/index' , {authors: authors})

    } catch {
        res.redirect('/');
    }
} )

// New Author routes 
router.get('/new' , ( req , res ) => {
    res.render('authors/new' , { author: new Author() })
})

// for creating the authors 
router.post('/' , async ( req , res ) => {
   const author = new Author({
       name: req.body.name
   })
   try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect('authors')
   } catch {
    res.status(400).render('authors/new' , {
                       author: author,
                       errorMsg: 'Error creating the New Author'
                   })
   }
})

// For displaying the authors 

module.exports = router
