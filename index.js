const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
});

const app = express();
// set the directory where the template files
app.set('views', './views');
// the template engine to use
app.set('view engine', 'pug');
// set public directory for static content
app.use("/public", express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

// const User = require('./models/User');

const verifyToken = (req, res, next) => {
    if (req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(' ');
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    message: 'Неверный токен'
                });
            }
            req.user = decoded;
            next();
        });
    }   else {
        res.status(401).json({
            status: 'error',
            message: 'Токен не обнаружен'
        })
    }
};

// app.post('/auth', (req, res) => {
//     const { email, password } = req.body;
//
//     if (email === 'admin@admin.com' && password === 'admin') {
//         const token = jwt.sign({ login: 'this' }, 'secret');
//         res.json({ token });
//     }   else {
//         res.status(401).json({
//             status: 'error',
//             message: 'Неверные логин или пароль'
//         })
//     }
// });

require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/verify.routes')(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
    console.log(`Server has been started ${PORT}`);
});