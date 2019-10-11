const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.auth = async (req, response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        response.status(500).json({
            status: "error",
            message: "Пользователь не найден"
        })
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        response.status(401).json({
            status: "error",
            message: "Пароли не совпадают"
        });
    } else {
        const token = jwt.sign({ login: user.email }, process.env.SECRET);
        response.status(200).json({
            status: "ok",
            message: {
                id: user._id,
                token: token
            }
        })
    }
};