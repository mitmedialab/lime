var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var gitter = require('./routes/gitter');
var courses = require('./routes/courses');
var users = require('./routes/users');
var announcements = require('./routes/announcements');

var app = express();
var auth = require('./authentication')(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', index);
app.use('/api/v1/gitter', gitter);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/announcements', announcements);

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, '/public')));


app.get('/login', ensureUnauthenticated,
  function(req, res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
  });

app.use('/', ensureAuthenticated);
app.use('/', express.static(path.join(__dirname, '/lemon/build')));


app.get('*', 
  function(req, res) {
    res.sendFile(path.join(__dirname+'/lemon/build/index.html'));
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

app.use('/auth/styles', express.static(path.join(__dirname, '/lemon/build/styles')));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login');
}

function ensureUnauthenticated(req, res, next) {
  if (!req.isAuthenticated()) { 
    return next(); 
  }
}

module.exports = app;
