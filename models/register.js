const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event_id: {type: String, required: true},
    reg_id: {type: String, required: true},
    date: { type: Date, required: true}
});

module.exports = mongoose.model('Register', RegisterSchema);