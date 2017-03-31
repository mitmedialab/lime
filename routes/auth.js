var express = require('express');
var request = require('superagent');
var router = express.Router();
var passport = require('passport');

var url = '/build/register/5';

router.get('/gitlab-login', function(req, res) {
  url = '/build/announcements';
  res.redirect('/auth/gitlab');
});

router.get('/gitlab-register', function(req, res) {
  url = '/build/register/5';
  res.redirect('/auth/gitlab');
});

router.get('/gitlab', 
  passport.authenticate('gitlab', { scope: ['api'] })
);

router.get('/github', 
  passport.authenticate('github', {scope: ['user', 'public_repo']})
);

router.get('/gitter', 
  passport.authenticate('oauth2', {
    successRedirect: '/build/announcements',
    failureRedirect: '/'
  })
);

router.get('/gitlab/callback', 
  passport.authenticate('gitlab', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect(url);
  }
);

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect('/auth/gitter');
  }
);

router.get('/gitter/callback', 
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    console.log('Successful login!');
    res.redirect('/build/register/8');
  }
);

module.exports = router;
