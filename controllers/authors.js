const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const book = require('../models/book');


// Authors routes
router.get('/' , async (req , res) =>  {
    let searchOptions = {};
    console.log(req.query);
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name , 'i')
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index' , {
            authors: authors , 
            searchOptions: req.query})

    } catch {
        res.redirect('/');
    }
} )

// New Author routes 
router.get('/new' , ( req , res ) => {
    res.render('authors/new' , { author: new Author() })
})

// For creating the authors 
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

router.get('/:id' , async (req ,res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await book.find({author: author.id}).limit(6).exec();
        res.render('authors/show' , {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
});

router.get('/:id/edit' , async (req ,res) => {
    let author 
    try {
        author =  await Author.findById(req.params.id);
        // author.name = req.body.name;
        // await author.save();
        res.render('authors/edit' , {author: author})
    } catch (err){
        res.redirect('/authors')
    }
})

router.put('/:id' , async (req ,res) => {
    let author 
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`)
    } catch {
        if( author == null ) {
            res.redirect('/')
        } else {
            res.render('authors/edit' , {
                author: author,
                errorMessage: 'Error while Updating the Author'
            })
        }

    }
})

router.get('/delete')

router.delete('/:id' , async (req , res) => {
    let author 
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch {
        if(author == null) {
            res.redirect('/')
        } else {
            let error = 'You Cannot Delete this author because he have some books in the Library'
            res.redirect(`/authors`)
        }
    }
})
// For displaying the authors 

module.exports = router
