const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'image/gif']

// All Books Route
router.get('/' , async (req , res ) => {
    let query = Book.find();
    if(req.query.title != null || req.query.title != '') {
        query = query.regex('title' , new RegExp(req.query.title , 'i'));
    }
    if(req.query.publishedBefore) {
        query = query.lte('publishDate' , req.query.publishedBefore)
    }
    if(req.query.publishAfter) {
        query = query.gte('publishDate' , req.query.publishedAfter)
    }
    try {
        const books = await query.exec();
        res.render('books/index' , {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route 
router.get('/new' , (req , res) => {
    renderNewPage(res , new Book())
})

// Create Book Route 
router.post('/' , async (req , res) => {
               const book = new Book({
                   title: req.body.title,
                   author: req.body.author,
                   publishDate: new Date(req.body.publishDate),
                   pageCount: req.body.pageCount,
                   description: req.body.description
               })
        saveCover(book , req.body.cover)
        
       try {
           const newBook = await book.save();
           console.log('Saved');
           // res.redirect(`books/${newBook.id}`)
           res.redirect('books');
           
        } catch(err) { 
            renderNewPage(res , book , true)
            console.log('Error while creating new book')
        }   
       
     
})


async function  renderNewPage(res , book , hasError = false ) {
    try {
        const authors = await Author.find({});
        const params = {
            'authors': authors,
            'book': book
        }
        if (hasError) {
                params.errorMsg = `Error while creating a new book `
        }
       res.render('books/new' , params)
       console.log(path.join(book.coverImagePath));
    } catch {
        console.log(`Error while creating new books`)
        res.redirect('/books')
    }
}

 function saveCover(book , coverEncoded) {
    
        if (coverEncoded == null) {
            console.log('Yes')
          return  res.redirect('books');
        
        } 
        const cover =  JSON.parse(coverEncoded);
        if(cover != null && imageMimeTypes.includes(cover.type)) {
            book.coverImage = new Buffer.from(cover.data , 'base64');
            book.coverImageType = cover.type
        }
   
}

module.exports = router;
