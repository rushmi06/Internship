const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    likes: {type: Array, default: []},
    shares: {type: Array, default: []}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
