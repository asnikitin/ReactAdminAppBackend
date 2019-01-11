const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    id: {
        type: Number,
        default: 0
    },
    userId: Number,
    gallery: {
        type: Array,
        default: []
    },
    category: String,
    title: String,
    body: String
}, {
    versionKey: false,
    strict: false
});

// var schema = mongoose.Schema({
//     img: {
//         data: Buffer,
//         contentType: String
//     }
// }, {
//     versionKey: false
// });

module.exports = {
    post: mongoose.model('post', PostSchema, 'post'),
    //MediaUpload: mongoose.model('MediaUpload', schema, 'MediaUpload'),
};