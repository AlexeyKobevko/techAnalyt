const Verify = require('../models/veryfy.model');
const User = require('../models/user.model');


exports.create = async (req, res) => {
    const desiredVerify = await Verify.findOne({ userId: req.query.id });
    const desiredUser = await User.findById(req.query.id);

    try {
        if (!desiredVerify || !desiredUser) {
            return res.status(452).send(`Произошла ошибка. Пользователь с id ${req.query.id} не найден`);
        }
        if (req.query.id !== desiredVerify.userId || req.query.id !== desiredUser._id.toString()) {
            return res.status(452).send('Попытка модификации url-запроса. Пользователь заблокирован.');
        }
        if (desiredVerify.userId !== desiredUser._id.toString()) {
            return res.status(452).send(`Идентификатор верификации не принадлежит данному пользователю. 
        Email ${desiredUser.email} заблокирован. Обратитесь в службу поддержки`);
        }
        if (desiredVerify.randomNumber !== req.query.rand) {
            return res.status(452).send(`Код верификации не принадлежит данному пользователю. 
        Email ${desiredUser.email} заблокирован. Обратитесь в службу поддержки`);
        }
        if (req.query.id === desiredVerify.userId && req.query.rand === desiredVerify.randomNumber) {
            desiredUser.isActive = true;
            await desiredUser.save();

            await desiredVerify.remove();
            return res.status(200).render('index',
                {text: 'Email успешно подтверждён. Авторизуйтесь в приложении для начала работы'});
        }
    }
    catch (e) {
        console.log(e);
    }
};