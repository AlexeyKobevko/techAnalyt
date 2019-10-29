module.exports = (app) => {
    const verify = require('../controllers/verify.controller.js');

    app.get('/verify', verify.create);
};