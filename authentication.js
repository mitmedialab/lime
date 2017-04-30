//passport, sessions and oauth strategies
var session = require('express-session');
var passport = require('passport');
// var Strategy = require('passport-github').Strategy;
var OAuth2Strategy  = require('passport-oauth2');
var GitlabStrategy  = require('passport-gitlab2');

//Relevant models
var User = require('./models/User');
// var Github_API = require('./models/Github_API');
var Gitlab_API = require('./models/Gitlab_API');
var Gitter_API = require('./models/Gitter_API');

//Oauth apps ids and secrets
// var githubClientId = require('./config/index').githubClientId;
// var githubClientSecret = require('./config/index').githubClientSecret;
var gitlabClientId = require('./config/index').gitlabClientId;
var gitlabClientSecret = require('./config/index').gitlabClientSecret;
var gitterClientId = require('./config/index').gitterClientId;
var gitterClientSecret = require('./config/index').gitterClientSecret;

//homepage uri and sessions secret
var homepageUri = require('./config/index').homepageUri;
var sessionSecret = require('./config/index').sessionSecret;

//exporting a function that sets up the passport authentication
module.exports = function (app) {

  //gitlab passport strategy for handling Oauth 
  passport.use(
    new GitlabStrategy({
      clientID: gitlabClientId,
      clientSecret: gitlabClientSecret,
      callbackURL: homepageUri+'/auth/gitlab/callback'
    },function(accessToken, refreshToken, profile, cb) {
      //Set the role to admin if Noor is the user
      var role = 'scholar';
      if (profile._json.id==1128287) {
        role = 'admin';
      }
      //extract relevant data from oauth callback to be added to the database
      var data = {
        gitlab_access_token: accessToken,
        id: profile._json.id,
        name: profile._json.name,
        affiliation: profile._json.organization,
        about: profile._json.bio,
        role: role,
        image: profile._json.avatar_url,
        portfolio: 'https://'+profile._json.username+'.gitlab.io/lime-portfolio',
      }

      //attempt to get the user if this is not their first time logging in
      User.get_user(data.id, function(error, results) {

        if (error) {
          return cb(error, null);
        }

        if (results) {
          return cb(null, profile);
        } else {
          //create a new user if their id is not already in the database
          User.create_user(data, function(err, result) {
            if (err) {
              return cb(err, null);
            }

            if (result) {
              return cb(null, profile);
            }
          });
        }
      });
  }));

  //github passport Oauth strategy 
  // passport.use(
  //   new Strategy({
  //     clientID: githubClientId,
  //     clientSecret: githubClientSecret,
  //     callbackURL: homepageUri+'/auth/github/callback'
  //   },function(accessToken, refreshToken, profile, cb) {
  //     var data = {
  //       github_access_token: accessToken,
  //       gitter_access_token: null,
  //       id: profile._json.id,
  //       name: profile._json.name,
  //       affiliation: profile._json.company,
  //       about: profile._json.bio,
  //       role: 'scholar',
  //       image: profile._json.avatar_url,
  //       portfolio: 'https://'+profile._json.login+'.github.io/lime-portfolio',
  //       chat_link: 'https://gitter.im/'+profile._json.login
  //     }

  //     User.get_user(data.id, function(error, results) {

  //       if (error) {
  //         return cb(error, null);
  //       }

  //       if (results) {
  //         return cb(null, profile);
  //       } else {
  //         User.create_user(data, function(err, result) {
  //           if (err) {
  //             return cb(err, null);
  //           }

  //           if (result) {
  //             Github_API.fork_portfolio(result.github_access_token, function(er, rest) {
  //               if (er) {
  //                 return cb(er, null);
  //               }
  //               if (rest) {
  //                 return cb(null, profile);
  //               }
  //             }); 
  //           }
  //         });
  //       }
  //     });
  // }));

  //gitter passport strategy for handling Oauth 
  passport.use(
    new OAuth2Strategy({
      authorizationURL:   'https://gitter.im/login/oauth/authorize',
      tokenURL:           'https://gitter.im/login/oauth/token',
      clientID:           gitterClientId,
      clientSecret:       gitterClientSecret,
      callbackURL:        homepageUri+'/auth/gitter/callback',
      passReqToCallback:  true 
    },function(req, accessToken, refreshToken, profile, done) {
      req.session.gitter_token = accessToken;

      //add the gitter token and chat_link to the user
      User.update_user(req.session.passport.user.id,{gitter_access_token: accessToken, chat_link: 'https://gitter.im/'+req.user.username}, function(err, result) {
        if (err) {
          return done(err, null);
        }

        if (result) {
          console.log('success');
          done(null, result);
        }
      });  
    }
  ));

  //serialize and deserialize users
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

  //setting up session middleware
  app.use(session({ 
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true 
  }));

  //telling the app to initialize passport and set up sessions
  app.use(passport.initialize());
  app.use(passport.session());
}
