const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create and Save a new User
exports.create = async (req, res) => {
    //Find user with same email
    const foundUser = await User.findOne ({ email : req.body.email });
    // Validate request
    if (!req.body.firstName) {
        return res.status(400).json({
            status: "error",
            message: "Поле имя обязательно для заполнения"
        });
    }
    if (!req.body.lastName) {
        return res.status(400).json({
            status: "error",
            message: "Поле фамилия обязательно для заполнения"
        });
    }
    if (!req.body.email) {
        return res.status(400).json({
            status: "error",
            message: "Поле электронная почта обязательно для заполнения"
        });
    }
    if (!req.body.password) {
        return res.status(400).json({
            status: "error",
            message: "Поле пароль обязательно для заполнения"
        });
    }
    if (!req.body.organization) {
        return res.status(400).json({
            status: "error",
            message: "Поле организация обязательно для заполнения"
        });
    }
    if (foundUser) {
        return res.status(400).json({
            status: "error",
            message: "Пользовотель с таким email уже существует",
        });
    }
    //Generate hash from password
    await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (!err) {
                // Create a User
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    organization: req.body.organization,
                });
                // Save User in the database
                user.save()
                    .then(data => {
                        const token = jwt.sign({ email: data.email }, process.env.SECRET);
                        res.json({
                            status: "ok",
                            message: {
                                id: data._id,
                                token: token,
                            }
                        });
                    }).catch(err => {
                    res.status(500).json({
                        status: "error",
                        message: err.message || "Some error occurred while creating the User."
                    });
                });

            } else {
                res.status(500).json({
                    status: "error",
                    message: err.message || "Some error occurred while creating the User."
                });
            }
        });
    });
};
// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "Не найден пользователь с id " + req.params.id
                });
            }
            res.json({
                status: "ok",
                message: {
                    firstName: user.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    organization: req.body.organization,
                }
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                status: "error",
                message: "Не найден пользователь с id " + req.params.id
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Ошибка при получении пользователя с id " + req.params.noteId
        });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Метод в разработке"
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Метод в разработке"
    });
};