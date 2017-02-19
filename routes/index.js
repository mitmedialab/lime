var express = require('express');
var request = require('superagent');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.isAuthenticated());
  res.render('index', { title: 'Express' });
});

module.exports = router;
