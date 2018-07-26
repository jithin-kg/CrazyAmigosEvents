const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken')

const Event = require('../models/events');
const Participants = require('../models/participants');
const Register = require('../models/register');

// const rn = require('random-number');
// const options = {
//     min: -1000
//     , max: 1000
//     , integer: true
// };
// rn(options)

//user logIn
router.post('/login',jsonParser, function(req, res, next) {
  const  user = {
      username : "bucky",
      password : "1234five"

    }
    jwt.sign({user:user},'secretKey',{expiresIn: '1h'}, function (err, token) {
        res.json(
            {
                "result": true,
                access_token: token,

            })
        
    })

});

// console.log(rn(options))

/* GET users listing. */
// router.post('/login',jsonParser, function(req, res, next) {
//     const username = req.body.username
//     const password = req.body.password
//     if(username ==='Bucky' && password ==="1234five" ){
//         res.status(200).json({message: 'successfully logged in'})
//     }else {
//         res.status(400).json({message:'invalid username or password'})
//     }
//
// });


//create a new Event
router.post('/create_event',verifyToken,jsonParser, function (req, res, next) {
    //verify the token
    jwt.verify(req.token, 'secretKey', function (err, authData) {
        if (err){
            res.status(403).json({message: 'error while verifying token'});
        }else {
            // res.json({
            //     message :'verified',
            //     authData
            //
            // })

               console.log('auth verified successfully ')
            //save the new event

                Event.findOne({event_name: req.body.event_name},function (err, eventData) {
                if(!err){
                    console.log(eventData)
                    if (!eventData){
                        const event = new Event({
                            _id : new mongoose.Types.ObjectId(),
                            event_name : req.body.event_name,  //bodyParser to parse body data/name
                            days : req.body.days,
                            no_of_participants: req.body.no_of_participants,
                            date: req.body.date,
                            venue: req.body.venue
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
                                        date: result.date,
                                        venue: result.venue,
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
        }
        
    })

});

//add_participant
router.post('/add_participant', verifyToken, jsonParser, function (req, res, next) {
    console.log('insied ad particpant')
    //verify token
    jwt.verify(req.token, 'secretKey', function (err, authData) {
        if (err) {
            res.status(403).json({message: 'error while verifying token'})
        }else {
            //save data if verified
            Participants.findOne({email_address: req.body.email_address },function (err, participantData) {
                if (!err) {
                    const eventId = req.body.event_id
                    console.log(participantData)
                    // Event.findOne({event_name: req.body.event_name},function (err, eventData) {
                    Event.findOne({_id: eventId},function (err, eventData) {
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
                                    reg_id:req.body.reg_id
                                });
                                participant.save()
                                    .then(result => {
                                        console.log(result)
                                        res.status(200).json({
                                            message: 'created  participant successfully',
                                            createdEvent: {
                                                name: result.name,
                                                phone_number: result.phone_number,
                                                _id: result._id,
                                                event_id: result.event_id,
                                                reg_id:req.body.reg_id,
                                                request : {
                                                    type: 'POST',
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

        }
    });

});

//list all Events
router.post('/list_events',verifyToken,function (req, res, next) {
    console.log("inside list events");
    jwt.verify(req.token, 'secretKey', function (err, authData) {
        if (err) {
            res.status(403).json({message: 'error while verifying token'})
        } else {
            Event.find({}, {}, function (err, eventsDoc) {
                if (err) {
                    res.status(404).json({message: "There was an error while getting events"})
                }
                if (eventsDoc) {
                    res.status(200).json({events: eventsDoc})
                    console.log(eventsDoc[2])
                }

            })
        }
    });
});

//list all participants
router.post('/list_participants',verifyToken,function (req, res, next) {
    console.log("inside list events");
    jwt.verify(req.token, 'secretKey', function (err, authData) {
        if (err) {
            res.status(403).json({message: 'error while verifying token'})
        } else {
            Participants.find({}, {}, function (err, participantstsDoc) {
                if (err) {
                    res.status(400).json({message: "There was an error while getting participants"})
                }
                if (eventsDoc) {
                    res.status(200).json({events: participantstsDoc})
                    console.log(participantstsDoc[2])
                }

            })
        }
    });
});


//daily Register
router.post('/daily_register', verifyToken, jsonParser, function (req, res, next) {
    console.log('inside ad register')
    //verify token
    jwt.verify(req.token, 'secretKey', function (err, authData) {
        if (err) {
            res.status(403).json({message: 'error while verifying token'})
        }else {
            //save data if verified
            Participants.findOne({reg_id: req.body.reg_id },function (err, participantData) {
                if (!err) {
                    // Event.findOne({event_name: req.body.event_name},function (err, eventData) {
                    Register.findOne({reg_id:req.body.reg_id},function (err, registerData) {
                        if(!err ) {
                            console.log(req.body.event_id)
                            // const idOfTheEvent = eventData._id

                            if (!participantData) {
                                res.status(400).json({message:'There is no record of the participant'})

                            }else {
                                console.log("there is a participant with the given details")
                                const register = new Register ({
                                    _id :new mongoose.Types.ObjectId(),
                                    event_id : req.body.event_id,  //bodyParser to parse body data/name
                                    reg_id : req.body.name,
                                    date: req.body.date
                                });
                                register.save()
                                    .then(result => {
                                        console.log(result)
                                        res.status(200).json({
                                            message: 'created  register successfully',
                                            createdEvent: {
                                                event_id : req.body.event_id,  //bodyParser to parse body data/name
                                                reg_id : req.body.name,
                                                date: req.body.date,
                                                request : {
                                                    type: 'POST',
                                                    url: 'http://localhost:3000/api/createParticipant' + result._id
                                                }
                                            }
                                        })
                                    })
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

        }
    });

});



//token
function verifyToken(req, res, next){
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !=="undefined"){
        //split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from the array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //call the next middleware
        next();

    }else {
        res.status(403).json({message:'forebidden'})
    }

}




module.exports = router