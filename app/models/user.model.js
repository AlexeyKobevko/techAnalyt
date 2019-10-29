const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true, unique:true },
    password: { type: String },
    organization: { type: String },
    isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema, 'users');