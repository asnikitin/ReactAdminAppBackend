const express = require('express');
const bodyParser = require('body-parser');
global.jwt = require('jwt-simple');
require('dotenv').config()
global.moment = require('moment-timezone');
global.ObjectId = require('mongodb').ObjectId;
global.formidable = require('formidable');
// create express app
const app = express();
const port = 3001;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers");
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });


// define a simple route
app.get('/', (req, res) => {
    res.json({
        "message": "Crud App Ready"
    });
});

const models = require('./app/models/dynamic.model.js');

Object.keys(models).map(function (key, index) {
    require('./app/routes/dynamic.routes.js')(app, key);
});

// require('./app/routes/note.routes.js')(app);
// require('./app/routes/post.routes.js')(app);
// require('./app/routes/user.routes.js')(app);
// require('./app/routes/register.routes.js')(app);
// require('./app/routes/role.routes.js')(app);

// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port", port);
});