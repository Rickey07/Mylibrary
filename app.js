const env = require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
const indexRouter = require('./controllers/index');
const authorsRouter = require('./controllers/authors');
const bookRouter = require('./controllers/books');


app.use('/' , indexRouter);
app.use('/authors' , authorsRouter);
app.use('/books' , bookRouter)

app.listen(port , () => {
    console.log(`Server started running on port${port}`);
})