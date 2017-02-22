var express = require('express');
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var User = require('./models/User');
var Github_API = require('./models/Github_API');
var index = require('./routes/index');
var courses = require('./routes/courses');
var users = require('./routes/users');
var announcements = require('./routes/announcements');

var app = express();

passport.use(
  new Strategy({
    clientID: "c62768a65dc854f5c218",
    clientSecret: "ebcddb443c7ed157bfa86986b15163568ddd5aa3",
    callbackURL: "http://127.0.0.1:3001/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    var data = {
      accessToken: accessToken,
      id: profile._json.id,
      name: profile._json.name,
      affiliation: profile._json.company,
      about: profile._json.bio,
      role: 'scholar',
      image: profile._json.avatar_url,
      portfolio: profile._json.login+'.github.io/lime-portfolio',
      chat_link: 'www.slack.com'
    }

    User.get_user(data.id, function(error, results) {

      if (error) {
        return cb(error, null);
      }

      if (results) {
        return cb(null, profile);
      } else {
        User.create_user(data, function(err, result) {
          if (err) {
            return cb(err, null);
          }

          if (result) {
            Github_API.fork_portfolio(result.accesstoken, function(er, rest) {
              if (er) {
                return cb(er, null);
              }
              if (rest) {
                return cb(null, profile);
              }
            }); 
          }
        });
      }
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/auth/styles', express.static(path.join(__dirname, '/lemon/build/styles')));

app.use(session({ 
  secret: 'my_precious',
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/announcements', announcements);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/auth/github', 
  passport.authenticate('github', {scope: ['user', 'public_repo']}));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect('/announcements');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, '/public')));


app.get('/login',
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
  res.render('error');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login');
}

module.exports = app;
