const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.auth = async (req, response) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return response.status(500).json({
                status: "error",
                message: "Пользователь не найден",
            });
        }
        if (user && !user.isActive) {
            return response.status(401).json({
                status: "error",
                message: "Email пользователя не подтвержден",
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            response.status(401).json({
                status: "error",
                message: "Неверный пароль"
            });
        } else {
            const token = jwt.sign({ login: user.email }, process.env.SECRET);
            response.status(200).json({
                status: "ok",
                message: {
                    user: {...user},
                    token: token
                }
            })
        }
    } catch (e) {
        throw new Error(e);
    }
};