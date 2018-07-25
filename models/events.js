const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event_name: {type: String, required: true},
    days: {type: Number, required: true},
    no_of_participants: { type: Number, required: true},
    date:{type:Date, required:true},
    venue: {type:String, required: true}
    // event_id:Number
});


module.exports = mongoose.model('Events', EventSchema);


