var express = require('express');
var request = require('superagent');
var router = express.Router();

var Gitter_API = require('../models/Gitter_API');

router.get('/user/:user_token', function(req, res, next) {
  Gitter_API.get_user_id(req.params.user_token, function(err, results) {
		if (err) {
			console.log('error');
			return res.status(500).json({success: false, data: err});
		}
		if (results) {
			console.log('success');
			return res.json(results);
		}
	});
});

router.post('/room/', function(req, res, next) {
  Gitter_API.add_user_to_room(req.body.token, req.body.room, function(err, results) {
		if (err) {
			console.log('error');
			return res.status(500).json({success: false, data: err});
		}
		if (results) {
			console.log('success');
			return res.json(results);
		}
	});
});

// router.post('/rooms/', function(req, res, next) {
//   Gitter_API.create_room(req.body.token, function(err, results) {
// 		if (err) {
// 			console.log('error');
// 			return res.status(500).json({success: false, data: err});
// 		}
// 		if (results) {
// 			console.log('success');
// 			return res.json(results);
// 		}
// 	});
// });


module.exports = router;
