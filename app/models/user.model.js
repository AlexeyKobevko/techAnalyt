const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, trim: true, unique:true },
    password: { type: String },
    organization: { type: String },
});

module.exports = mongoose.model('User', userSchema, 'users');