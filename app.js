/* jshint esversion:6 */
require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const schedule = require("node-schedule");
const winston_logger = require("./util/logger.js");

const index = require('./routes/index'),
  users = require('./routes/users'),
  status = require('./routes/status'),
  tweets = require('./routes/tweets');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/status', status);
app.use('/tweets', tweets);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  winston_logger.error(err.message);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var j = schedule.scheduleJob('1 * * * *', function () {

  winston_logger.debug("Calling child process...");

  const { spawn } = require('child_process');

  const deleteOldTweets = spawn('node', [path.join(__dirname, "./clearDB.js")], {});

  let stderr = "";

  deleteOldTweets.stdout.on('data', data => {

    winston_logger.debug(data.toString());

  });

  deleteOldTweets.stderr.on('data', data => {

    stderr += data;

  });

  deleteOldTweets.on('close', code => {

    if (code !== 0)
      winston_logger.error(stderr);

    winston_logger.debug(`child process exited with code ${code}`);
  });
});

module.exports = app;