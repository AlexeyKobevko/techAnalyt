module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', user.create);

    // Retrieve all Users
    //TODO  нужны ли нам все пользователи?
    // app.get('/user', user.findAll);

    // Retrieve a User with userId
    app.get('/users/:id', user.findOne);

    // Update a User with userId
    app.put('/users/:id', user.update);

    // Delete a User with userId
    //TODO неуверен в необходимости этого метода или передать его только администратору
    // app.delete('/note/:noteId', notes.delete);
};