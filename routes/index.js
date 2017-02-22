var express = require('express');
var request = require('superagent');
var router = express.Router();

var Github_API = require('../models/Github_API');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/fork_portfolio', function(req, res, next) {
	Github_API.fork_portfolio(req.body.token, function(err, results) {
		if (err) {
			return res.status(500).json({success: false, data: err});
		}
		if (results) {
			return res.json(results);
		}
	});
});


module.exports = router;
