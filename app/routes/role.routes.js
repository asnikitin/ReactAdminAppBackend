module.exports = (app) => {
    const role = require('../controllers/role.controller.js');

    // Retrieve user (GET_LIST)
    app.get('/role', role.GetAllRole);

    // create role (CREATE)
    app.post('/role', role.CreateRole);

    // update a user (UPDATE)
    //app.put('/role/:Id', role.update);

    // delete user (DELETE)
    //app.delete('/role/:Id', role.delete);

    //Retrieve user by id (GET_MANY)
    //app.get('/role/:Id', role.getbyid);



}