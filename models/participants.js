const mongoose = require('mongoose');

const ParticipantsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event_id: {type: String, required: true},
    name: {type: String, required: true},
    email_address: { type: String, required: true},
    phone_number:String,
    organization: { type: String, required: true},
});

module.exports = mongoose.model('Participants', ParticipantsSchema);