const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    userId: Number,
    id: Number,
    title: String,
    body: String
});

module.exports = mongoose.model('post', PostSchema, 'post');