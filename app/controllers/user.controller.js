const User = require('../models/user.model');
const Verify = require('../models/veryfy.model');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASS,
    }
});

// Create and Save a new User
exports.create = async (req, res) => {
    //Find user with same email
    const foundUser = await User.findOne ({ email : req.body.email });
    // Validate request
    if (!req.body.name) {
        return res.status(400).json({
            status: "error",
            message: "Поле имя обязательно для заполнения"
        });
    }
    if (!req.body.phone) {
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
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hash,
                    organization: req.body.organization,
                });


                // Save User in the database
                user.save()
                    .then(data => {
                        const randomNumber = Math.floor((Math.random() * 100) + 54);
                        // const url = `https://arcane-eyrie-30150.herokuapp.com/?id=${data._id}&rand=${randomNumber}`;
                        const url = `http://localhost:8888/?id=${data._id}&rand=${randomNumber}`;
                        const mailOptions = {
                            from: `Technical|Analytics <${process.env.MAIL_NAME}@${process.env.MAIL_HOST}>`,
                            to: data.email,
                            subject: 'Please confirm your Email account',
                            html: `Hello, ${data.name}<br> <a href="${url}">Click to end registration</a>`
                        };
                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log(error);
                            }
                            if (response) {
                                const verify = new Verify({
                                    userId: data._id,
                                    randomNumber: randomNumber,
                                });
                                verify.save()
                                    .then( info => {
                                        res.status(200).json({
                                            status: "ok",
                                            message: "Проверьте почту для завершения регистрации",
                                        });
                                    })
                            }
                        });

                        // const token = jwt.sign({ email: data.email }, process.env.SECRET);
                        // res.json({
                        //     status: "ok",
                        //     message: {
                        //         // id: data._id,
                        //         // token: token,
                        //     }
                        // });
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
                    name: user.name,
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