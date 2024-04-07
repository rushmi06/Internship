const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
});

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    posterurl: { type: String, required: true },
    views: { type: Number, default: 0 },
    songs: [songSchema]
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
