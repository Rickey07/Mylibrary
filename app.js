const env = require('dotenv').config();


const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const expressLayouts = require('express-ejs-layouts');
const Router = require('./controllers/index');
const mongoose = require('mongoose');

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
app.use(express.static('public'));


app.use('/' , Router)

app.listen(port , () => {
    console.log(`Server started running on port${port}`);
})