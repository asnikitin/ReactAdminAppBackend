module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Retrieve user (GET_LIST)
    app.get('/users', users.findAll);

    // update a user (UPDATE)
    app.put('/users/:Id', users.update);

    // delete user (DELETE)
    app.delete('/users/:Id', users.delete);

    //Retrieve user by id (GET_MANY)
    app.get('/users/:Id', users.getbyid);

    // user login (post)
    app.post('/validation', users.login);


}