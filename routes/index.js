var express = require('express');
var request = require('superagent');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.isAuthenticated());
  res.render('index', { title: 'Express' });
});

//Is authenticated
router.get('/authenticated/', (req, res, next) => {

  return res.json({authenticated: req.isAuthenticated()});

});

module.exports = router;
