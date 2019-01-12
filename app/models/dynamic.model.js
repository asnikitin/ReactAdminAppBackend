const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    name: String
}, {
    versionKey: false,
    strict: false
});

const SettingsSchema = mongoose.Schema({
    name: String
}, {
    versionKey: false,
    strict: false
});

const AnalyticsSchema = mongoose.Schema({
    name: String
}, {
    versionKey: false,
    strict: false
});

const PagesSchema = mongoose.Schema({
    name: String
}, {
    versionKey: false,
    strict: false
});

const UserSchema = mongoose.Schema({
    id: Number,
    name: String,
    username: String,
    email: String,
    address: {
        street: String,
        suite: String,
        city: String,
        zipcode: String,
        geo: {
            lat: String,
            lng: String
        }
    },
    phone: String,
    website: String,
    company: {
        name: String,
        catchPhrase: String,
        bs: String
    }
}, {
    versionKey: false,
    strict: false
});

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


module.exports = {
    comments: mongoose.model('comments', CommentSchema, 'comments'),
    settings: mongoose.model('settings', SettingsSchema, 'settings'),
    posts: mongoose.model('posts', PostSchema, 'posts'),
    analytics: mongoose.model('analytics', AnalyticsSchema, 'analytics'),
    pages: mongoose.model('pages', PagesSchema, 'pages'),
    users: mongoose.model('users', UserSchema, 'users'),
};