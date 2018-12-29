const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    userId: Number,
    id: {
        type: Number,
        default: 0
    },
    image: String,
    title: String,
    body: String,
    forwardlinks: {},
    backlinks: {},
}, {
    versionKey: false,
    strict: false
});

var schema = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    }
}, {
    versionKey: false
});


module.exports = {
    post: mongoose.model('post', PostSchema, 'post'),
    MediaUpload: mongoose.model('MediaUpload', schema, 'MediaUpload'),
};