// --------------------------------------------------------- //
// The Gitter API Router                                	   //
// The router handling all gitter api cals to /api/v1/gitter //
// --------------------------------------------------------- //

/** 
 * Express Imports
 * @import express the main express web framework
 * @import router the express router to handle api calls
 **/
var express = require('express');
var router = express.Router();

//Gitter_API model for accessing gitter api
var Gitter_API = require('../models/Gitter_API');

//GET User Gitter Id
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

//ADD User to Room
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

module.exports = router;
