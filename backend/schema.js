const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    }, 
    releasedYear: {
        type: Number,
        required: true,
    },
    imdbID: {
        type: String,
        unique: true,
        required: true,
    }
});

module.exports = mongoose.Model('Movie', movieSchema);