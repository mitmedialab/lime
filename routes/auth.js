var express = require('express');
var request = require('superagent');
var router = express.Router();
var passport = require('passport');


router.get('/github', 
  passport.authenticate('github', {scope: ['user', 'public_repo']})
);

router.get('/gitter', 
  passport.authenticate('oauth2', {
    successRedirect: '/build/announcements',
    failureRedirect: '/'
  })
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
    res.redirect('/build/announcements');
  }
);

module.exports = router;
