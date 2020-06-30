const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const { render } = require('ejs');
const checkUndefined = require('../app');
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'image/gif']

// All Books Route
router.get('/' , async (req , res ) => {
        if(req.user == undefined) {
            userName = [];
        }
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
            searchOptions: req.query,
            userName: req.user
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route 
router.get('/new' , (req , res) => {
    renderNewPage(req ,res , new Book())
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
            renderNewPage(req ,res , book , true) 
            console.log('Error while creating new book')
        }   
       
     
})
// For Displaying The Book
router.get('/:id' , async (req ,res) => {
    if(req.user == undefined){
        req.user = []
    }
    try {
        const book = await Book.findById(req.params.id)
            .populate('author')
            .exec();


            res.render('books/show' , {book : book , userName: req.user})

    } catch {
        res.redirect('/')
    }
})

// For Editing The Book 
// Edit Book Page 
router.get('/:id/edit' , async (req , res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(req ,res , book ,'edit')
    } catch {
        res.redirect('/')
    }
})

// For Actual Editing Of the Page 


router.put('/:id' , async (req , res) => {
   let book 

try {
  const book = await Book.findById(req.params.id)
  book.title = req.body.title;
  book.author = req.body.author;
  book.publishDate = new Date(req.body.publishDate);
  book.pageCount = req.body.pageCount;
  book.description = req.body.description;
  if(req.body.cover) {
    saveCover(book , req.body.cover)
  }
  await book.save()
  console.log('Updated');
  res.redirect(`/books/${book.id}`);

} catch(err) {
    console.log(err)
    if(book != null) {
        renderEditPage( req ,res , book , true)
    }
    else {
        res.redirect('/')
    }
}   


})

router.delete('/:id' , async (req ,res) => {
    let book 
    try {
        book = await Book.findById(req.params.id);
        book.remove();
        res.redirect('/books');
    } catch {
        if(book) {
            res.render('books/show' , {
                book: book,
                errorMessage: 'Could Not remove Book'
            })
        } else {
            res.redirect('/')
        }
    }
})

// Encapsulation Helping Functions 
async function  renderNewPage(req , res , book , hasError = false ) {
  renderFormPage(req, res , book , 'new' , hasError)
}
async function  renderEditPage(req , res , book , hasError = false ) {
    renderFormPage(req,res , book , 'edit' , hasError)
}

async function renderFormPage( req ,res , book ,form , hasError = false) {
    if(req.user == undefined) {
        userName = []
    }
    try {
        const authors = await Author.find({});
        const params = {
            'authors': authors,
            'book': book,
            userName:req.user
        }
        if(hasError) {
            if(form === 'edit') {
                params.errorMessage = 'Error While Updating the Book Please Make sure To Enter All Fields'
            } else {
                params.errorMessage = 'Error Creating a Book Please Try Again Later'
            }
        }

        if (hasError) {
                params.errorMsg = `Error while creating a new book `
        }
       res.render(`books/${form}` , params)
       console.log(path.join(book.coverImagePath));
    } catch {
        // console.log(`Error while creating new books`)
        // res.redirect('books')
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
