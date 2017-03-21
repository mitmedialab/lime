//node modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//instantiate the app
var app = express();
//setup passport authentication
var authentication = require('./authentication')(app);

//require routes
var index = require('./routes/index');
var gitter = require('./routes/gitter');
var courses = require('./routes/courses');
var users = require('./routes/users');
var announcements = require('./routes/announcements');
var auth = require('./routes/auth');

//use middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//setup middleware for auth routes 
app.use('/auth', auth);

//setup middleware for api routes
app.use('/api/v1/gitter', gitter);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/announcements', announcements);

//statically serve react build 
app.use('/build', express.static(path.join(__dirname, '/lemon/build')));

//send all urls following /build/ to the react app for react router to handle
app.get('/build/*', 
  function(req, res) {
    res.sendFile(path.join(__dirname+'/lemon/build/index.html'));
  });

//logout the user and remove from sessions
app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

//redirect react router paths to build/*
app.get('/', function(req, res){
  res.redirect('/build/');
});
app.get('/announcements', function(req, res){
  res.redirect('/build/announcements');
});
app.get('/community', function(req, res){
  res.redirect('/build/community');
});
app.get('/courses', function(req, res){
  res.redirect('/build/courses');
});
app.get('/*', function(req, res){
  res.redirect('/build/404');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
