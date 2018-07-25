const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Event = require('../models/events');
const Participants = require('../models/participants');

// const rn = require('random-number');
// const options = {
//     min: -1000
//     , max: 1000
//     , integer: true
// };
// rn(options)

//user logIn
router.post('/login',jsonParser, function(req, res, next) {
    console.log('hi')
    if(req.body.username ==="Bucky" && req.body.password === "1234five"){
        res.status(200).json({message:'successfully logged in'})
    }else {
        res.status(400).json({message:'invalid username or password'})
    }

});

// console.log(rn(options))

/* GET users listing. */
router.post('/login',jsonParser, function(req, res, next) {
    const username = req.body.username
    const password = req.body.password
    if(username ==='Bucky' && password ==="1234five" ){
        res.status(200).json({message: 'successfully logged in'})
    }else {
        res.status(400).json({message:'invalid username or password'})
    }

});


//create a new Event
router.post('/create_event',jsonParser, function (req, res, next) {
    console.log(req.body.event_name)

    let event_id = 1234; //sample id

    Event.findOne({event_name: req.body.event_name},function (err, eventData) {
        if(!err){
            console.log(eventData)
            if (!eventData){
                console.log(req.body.event_name)
                const event = new Event({
                    _id : new mongoose.Types.ObjectId(),
                    event_name : req.body.event_name,  //bodyParser to parse body data/name
                    days : req.body.days,
                    no_of_participants: req.body.no_of_participants,
                    // event_id: event_id
                });
                event.save()
                    .then(result => {
                        console.log(result)
                        res.status(200).json({
                            message: 'created  event successfully',
                            createdEvent: {
                                name: result.event_name,
                                days: result.days,
                                _id: result._id,
                                // event_id:event_id,
                                request : {
                                    type: 'GET',
                                    url: 'http://localhost:3000/api/createEvent' + result._id
                                }
                            }
                        })
                    })
            }else {
                res.status(202).json({message:'The event already exist'})
            }
        }else {
            res.status(400).json({message:'Sorry something went wrong'})
        }

    })


});

//add_participant
router.post('/add_participant',jsonParser, function (req, res, next) {
    console.log('insied ad particpant')
    Participants.findOne({email_address: req.body.email_address },function (err, participantData) {
        if (!err) {
            console.log(participantData)
            Event.findOne({event_name: req.body.event_name},function (err, eventData) {
                if(!err ) {
                    console.log(req.body.event_id)
                    // const idOfTheEvent = eventData._id

                    if (!participantData) {
                        const participant = new Participants({
                            _id :new mongoose.Types.ObjectId(),
                           event_id : req.body.event_id,  //bodyParser to parse body data/name
                            name : req.body.name,
                            phone_number: req.body.phone_number,
                            email_address: req.body.email_address,
                            organization: req.body.organization,
                                });
                        participant.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'created  participant successfully',
                                    createdEvent: {
                                        name: result.name,
                                        phone_number: result.phone_number,
                                        _id: result._id,
                                        event_id: result.event_id,
                                        request : {
                                            type: 'GET',
                                            url: 'http://localhost:3000/api/createParticipant' + result._id
                                        }
                                    }
                                })
                            })
                    }else {
                        console.log("there is a participant with the given details")
                    }
                    if (!eventData) {
                        console.log("there is no such event found")
                    }
                }

            })
        }else {
            console.log("something went wrong while finding the participant")
        }
    })
});


//list all Events
router.get('/list_events',function (req, res, next) {
    Event.find({},{}, function (err, eventsDoc) {
        if (err){
           res.status(404).json({message: "There was an error while getting events"})
        } if(eventsDoc){
            res.status(200).json({message: eventsDoc})
        }
        
    })

})




module.exports = router