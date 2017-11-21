const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    authors: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imgurl: {
        type: String,
        trim: true
    },
    user: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('book', bookSchema);