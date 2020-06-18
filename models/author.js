const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    }
});


exports = mongoose.model('Author', authorSchema)