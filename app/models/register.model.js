const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    createddate: {
        type: Date,
        default: Date.now
    }

}, {
    versionKey: false
});

module.exports = mongoose.model('register', RegisterSchema, 'register');