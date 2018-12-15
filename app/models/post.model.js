const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    userId: Number,
    id: {
        type: Number,
        default: 0
    },
    title: String,
    body: String
}, {
    versionKey: false
});

module.exports = mongoose.model('post', PostSchema, 'post');