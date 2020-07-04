const env = require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');



mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true , useUnifiedTopology: true})
.then(done => {
    console.log('MONGODB CONNECTED')
})
.catch(err => {
    console.log(`Can't connect because of this ${err}`)
})

// Set the view engine
app.set('view engine' , 'ejs');
app.set('views' , __dirname + '/views');
app.set('layout' , 'layouts/layouts');
app.use(expressLayouts);
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

const indexRouter = require('./controllers/index');
const authorsRouter = require('./controllers/authors');
const bookRouter = require('./controllers/books');
const userRouter = require('./controllers/user')


app.use('/' ,  indexRouter);
app.use('/authors' , checkAuth , authorsRouter);
app.use('/books' , checkAuth , bookRouter);
app.use('/user' , checkNotAuth , userRouter)

app.delete('/logout' , (req , res) => {
    req.logOut();
    res.redirect('/user/login');
})
function  checkAuth  (req ,res , next)  {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}

function checkNotAuth (req ,res , next) {
    if(req.isAuthenticated()) {
        res.redirect('/')
    }
    next()
}


app.listen(process.env.PORT || 3000 , () => {
    console.log(`Server started running on port${process.env.PORT}`);
})