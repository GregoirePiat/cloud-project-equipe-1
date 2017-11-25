/**
 * init mongoose
 */
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/prod',{ useMongoClient: true }); //To change
//mongoose.connect('localhost:27017'); //To change
//Test connexion
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {/* we're connected!*/console.log("we're connected") });

let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');

let index = require('./routes/index');
let user = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(req.app.get('env') === 'development' ? err : err.message);
});

module.exports = app;
