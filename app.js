const createError = require('http-errors');
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
//const session = require('express-session');
// const passport = require('passport');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const api = require('./routes/api');


const app = express();

const dbURI = 'mongodb://localhost/eventManagement';
// Create the database connection
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});


app.use(logger('dev'));
// app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(bodyParser.json());// to extract json
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({extended : false}));//to extract url encoded body (only short data)
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     secret:'mySuperSecret',
//     resave:false,
//     saveUninitialized:false,
//     store: new MongoStore({mongooseConnection:mongoose.connection}),
//     cookie: { maxAge : 180 * 60 * 1000 }
// }));//my express session
// app.use(passport.initialize());
// app.use(passport.session());


app.use('/', indexRouter);
// app.use('/users', usersRouter);
 app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
res.status(401).json({mesage:'there was an error'})

  // render the error page
  res.status(err.status || 500);

});

module.exports = app;
