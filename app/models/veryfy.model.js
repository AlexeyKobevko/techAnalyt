const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifySchema = new Schema({
    userId: { type: String },
    randomNumber: { type: String },
});

module.exports = mongoose.model('Verify', verifySchema, 'verify');