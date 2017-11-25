const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const user = require('./routes/users');
const mongoose = require('mongoose');

/**
 * init express app
 */
const app = express();
const env = app.get('env').trim();

/**
 * Select config
 */
let config;
console.log("Mode : " + env);
if (env === "production"){
    config = require('./config.prod');
} else {
    console.log("dev");
    config = require('./config.dev');
}

/**
 * init mongoose
 */
mongoose.connect(config.db, {useMongoClient: true}); //To change
//mongoose.connect('localhost:27017'); //To change
//Test connexion
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {/* we're connected!*/
    console.log("we're connected")
});





/**
 * set some middleware
 */
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: false}));


app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(req.app.get('env') === 'development' ? err : err.message);
});

module.exports = app;
