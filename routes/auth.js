// -------------------------------------------- //
// The OAuth Router                             //
// The router handling all oauth calls to /auth //
// -------------------------------------------- //

/** 
 * Express Imports
 * @import express the main express web framework
 * @import router the express router to handle api calls
 * @import passport strategy for authentication
 **/
var express = require('express');
var router = express.Router();
var passport = require('passport');

//the url to redirect to after registering
var url = '/build/register/5';

//Gitlab Login OAuth
router.get('/gitlab-login', function(req, res) {
  url = '/build/announcements';
  res.redirect('/auth/gitlab');
});

//Gitlab Registration OAuth
router.get('/gitlab-register', function(req, res) {
  url = '/build/register/5';
  res.redirect('/auth/gitlab');
});

//Gitlab OAuth
router.get('/gitlab', 
  passport.authenticate('gitlab', { scope: ['api'] })
);

//Github OAuth
router.get('/github', 
  passport.authenticate('github', {scope: ['user', 'public_repo']})
);

//Gitter OAuth
router.get('/gitter', 
  passport.authenticate('oauth2', {
    successRedirect: '/build/announcements',
    failureRedirect: '/'
  })
);

//Gitlab OAuth Callback
router.get('/gitlab/callback', 
  passport.authenticate('gitlab', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect(url);
  }
);

//Github OAuth Callback
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect('/auth/gitter');
  }
);

//Gitter OAuth Callback
router.get('/gitter/callback', 
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect('/build/register/8');
  }
);

module.exports = router;
