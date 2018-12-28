module.exports = (app) => {
    const role = require('../controllers/role.controller.js');

    // Retrieve user (GET_LIST)
    app.get('/role', role.GetAllRole);

    // create role (CREATE)
    app.post('/role', role.CreateRole);
    
    // delete user (DELETE)
    app.delete('/role/:Id', role.DeleteRole);

    //Change user permission or restrictions
    app.post('/ChangePermission', role.ChangePermission);

    //get user permission or restrictions by rolename
    app.get('/GetAllPermissionByRole', role.GetAllPermissionByRole);

    //ckeck user permission or restrictions by module and permission type
    app.get('/CheckRights', role.CheckRights);


}