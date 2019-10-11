const bcrypt = require('bcryptjs');

let pass = '123456'; // Пароль
let saltRounds = 10; // Число проходов хэша, по умолчанию 10

// Зашифровать пароль
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
        if (!err) {
            console.log(hash);
        } else {
            console.log('Ошибка: ', err);
        }
    });
});