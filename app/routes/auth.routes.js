module.exports = (app) => {
    const user = require('../controllers/auth.controller.js');

    // Auth a User
    app.post('/auth', user.auth);
};