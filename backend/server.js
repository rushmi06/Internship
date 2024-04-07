const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('./model/SongModel')
const User = require('./model/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.listen(3002,()=>console.log('server is running on port'+3002));
mongoose.connect('mongodb://127.0.0.1:27017/musictym').then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});
app.post('/upload', async (req, res) => {
    try {
        const songs = req.body; // Assuming the request body contains an array of songs directly
        const insertedSongs = await Movie.insertMany(songs); // Using insertMany for inserting an array
        res.status(200).json({ message: 'Songs saved successfully', insertedSongs });
    } catch (err) {
        console.error('Error saving song data:', err);
        res.status(500).json({ error: 'Error saving song data',err:err});
    }
});

app.get('/tollywood', async (req, res) => {
    try {
        const tollywoodSongs = await Movie.find({ category: 'Tollywood' }); // Assuming category field holds the category information
        res.status(200).json(tollywoodSongs);
    } catch (err) {
        console.error('Error fetching Tollywood data:', err);
        res.status(500).json({ error: 'Error fetching Tollywood data' });
    }
});
app.get('/bollywood', async (req, res) => {
    try {
        const bollywoodSongs = await Movie.find({ category: 'Bollywood' }); // Assuming category field holds the category information
        res.status(200).json(bollywoodSongs);
    } catch (err) {
        console.error('Error fetching Tollywood data:', err);
        res.status(500).json({ error: 'Error fetching Tollywood data' });
    }
});


app.get('/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.status(200).json(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/movie/:movieId/song/:songId', async (req, res) => {
    const movieId = req.params.movieId;
    const songId = req.params.songId;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const song = movie.songs.find(song => song._id == songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found in the movie' });
        }

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (user.password !== req.body.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.json({ name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});