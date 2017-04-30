// --------------------------------------------------------- //
// The Announcements Router                                  //
// The router handling all api cals to /api/v1/announcements //
// --------------------------------------------------------- //

/** 
 * Express Imports
 * @import express the main express web framework
 * @import router the express router to handle api calls
 **/
var express = require('express');
var router = express.Router();

//Announcements ORM for manipulating announcements data
var Announcement = require('../models/Announcement');

//Create Announcement
router.post('/', function (req, res, next) {
  var data = {
  	header: req.body.header, 
  	message: req.body.message, 
  	user_id: req.body.user_id
  };

  Announcement.create_announcement(data, function(error, results) {
    console.log('error', error);
    console.log('results', results);

    if (error) {
      return res.status(500).json({success: false, data: error});
    }

    if (results) {
      return res.json(results);
    }
  });
});

//Read Announcement
router.get('/:announcement_id', function (req, res, next) {
  var id = req.params.announcement_id;

  Announcement.get_announcement(id, function(error, results) {
    console.log('error', error);
    console.log('results', results);

    if (error) {
      return res.status(500).json({success: false, data: error});
    }

    if (results) {
      return res.json(results);
    }
  });
});

//Read Announcements
router.get('/', function (req, res, next) {
  Announcement.get_announcements(function(error, results) {
    console.log('error', error);
    console.log('results', results);

    if (error) {
      return res.status(500).json({success: false, data: error});
    }

    if (results) {
      return res.json(results);
    }
  });
});

//Update Announcement
router.put('/:announcement_id', function (req, res, next) {
  var id = req.params.announcement_id;
  
  var data = {
  	header: req.body.header, 
  	message: req.body.message, 
  	user_id: req.body.user_id
  };
  
  Announcement.update_announcement(id, data, function(error, results) {
    console.log('error', error);
    console.log('results', results);

    if (error) {
      return res.status(500).json({success: false, data: error});
    }

    if (results) {
      return res.json(results);
    }
  });
});

//Delete Announcement
router.delete('/:announcement_id', function (req, res, next) {
  var id = req.params.announcement_id;
  
  Announcement.soft_delete_announcement(id, function(error, results) {
    console.log('error', error);
    console.log('results', results);

    if (error) {
      return res.status(500).json({success: false, data: error});
    }

    if (results) {
      return res.json(results);
    }
  });
});

module.exports = router;
