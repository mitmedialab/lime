var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var OAuth2Strategy  = require('passport-oauth2');

var User = require('./models/User');
var Github_API = require('./models/Github_API');
var Gitter_API = require('./models/Gitter_API');

var githubClientId      = process.env.GITHUB_KEY ? process.env.GITHUB_KEY.trim() : "c62768a65dc854f5c218";
var githubClientSecret  = process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET.trim() : "ebcddb443c7ed157bfa86986b15163568ddd5aa3";

var gitterClientId      = process.env.GITTER_KEY ? process.env.GITTER_KEY.trim() : "2079dcbbb18875d92d698ca634ccbddb1d250df3";
var gitterClientSecret  = process.env.GITTER_SECRET ? process.env.GITTER_SECRET.trim() : "76ca07b7ca35fb324bcaf91f065318932663175d";

module.exports = function (app) {

  passport.use(
    new Strategy({
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: "http://127.0.0.1:3001/auth/github/callback"
    },function(accessToken, refreshToken, profile, cb) {
      var data = {
        github_access_token: accessToken,
        gitter_access_token: null,
        id: profile._json.id,
        name: profile._json.name,
        affiliation: profile._json.company,
        about: profile._json.bio,
        role: 'scholar',
        image: profile._json.avatar_url,
        portfolio: 'https://'+profile._json.login+'.github.io/lime-portfolio',
        chat_link: 'https://gitter.im/'+profile._json.login
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
              Github_API.fork_portfolio(result.github_access_token, function(er, rest) {
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

  passport.use(
    new OAuth2Strategy({
      authorizationURL:   'https://gitter.im/login/oauth/authorize',
      tokenURL:           'https://gitter.im/login/oauth/token',
      clientID:           gitterClientId,
      clientSecret:       gitterClientSecret,
      callbackURL:        '/auth/gitter/callback',
      passReqToCallback:  true 
    },function(req, accessToken, refreshToken, profile, done) {
      req.session.gitter_token = accessToken;
      User.update_user(req.session.passport.user.id,{gitter_access_token: accessToken}, function(err, result) {
        if (err) {
          return done(err, null);
        }
        //change this a little 
        if (result) {
          console.log('success');
          done(null, result);
        }
      });  
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

  app.use(session({ 
    secret: 'my_precious',
    resave: true,
    saveUninitialized: true 
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github', 
    passport.authenticate('github', {scope: ['user', 'public_repo']})
  );

  app.get('/auth/gitter', 
    passport.authenticate('oauth2', {
      successRedirect: '/announcements',
      failureRedirect: '/'
    })
  );

  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
      console.log('Successful login!');
      res.redirect('/auth/gitter');
    }
  );

  app.get('/auth/gitter/callback', 
    passport.authenticate('oauth2', { failureRedirect: '/' }),
    function(req, res) {
      console.log('Successful login!');
      res.redirect('/announcements');
    }
  );
}
