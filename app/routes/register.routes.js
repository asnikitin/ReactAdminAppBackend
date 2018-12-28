module.exports = (app) => {
    const register = require('../controllers/register.controller.js');

    // user register (post)
    app.post('/registration', register.registration);

    // user login (post)
    app.post('/validation', register.login);

    //user email verification (Get)
    app.get('/verification', register.VerificationController);

    //user (Get)
    app.get('/GetAllUsers', register.GetAllUsers);

    //user update role (Get)
    app.put('/UpdateUserRole/:UserId', register.UpdateUserRole);

}