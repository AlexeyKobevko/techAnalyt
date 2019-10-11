const bcrypt = require('bcryptjs');

// let pass = '123456'; // Пароль
// let saltRounds = 12; // Число проходов хэша, по умолчанию 10

// Зашифровать пароль
const createHash = (pass) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
            if (!err) {
                console.log(hash);
            } else {
                console.log('Ошибка: ', err);
            }
        });
    });
};

module.export = createHash;