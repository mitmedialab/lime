// --------------------------------------------------- //
// The Courses Router                                  //
// The router handling all api cals to /api/v1/courses //
// --------------------------------------------------- //

/** 
 * Express Imports
 * @import express the main express web framework
 * @import router the express router to handle api calls
 **/
var express = require('express');
var router = express.Router();

//Courses ORM for manipulating courses data
var Course = require('../models/Course');


//Create Course
router.post('/', function (req, res, next) {
  var data = {
    title: req.body.title, 
    source: req.body.source, 
    description: req.body.description, 
    image: req.body.image,
    course_link: req.body.course_link,
    chat_link: req.body.chat_link
  };

  Course.create_course(data, function(error, results) {
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


//Read Course
router.get('/:course_id', function (req, res, next) {
  var id = req.params.course_id;

  Course.get_course(id, function(error, results) {
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

//Read Courses
router.get('/', function (req, res, next) {
  Course.get_courses(function(error, results) {
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

//Update Course
router.put('/:course_id', function (req, res, next) {
  var id = req.params.course_id;
  
  var data = {
    title: req.body.title, 
    source: req.body.source, 
    description: req.body.description, 
    image: req.body.image,
    course_link: req.body.course_link,
    chat_link: req.body.chat_link
  };
  
  Course.update_course(id, data, function(error, results) {
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

//Delete Course
router.delete('/:course_id', function (req, res, next) {
  var id = req.params.course_id;
  
  Course.soft_delete_course(id, function(error, results) {
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

//Read Course Users
router.get('/users/:course_id', function (req, res, next) {
  var course_id = req.params.course_id;

  Course.get_course_users(course_id, function(error, results) {
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

//Read Course Activities
router.get('/activities/:course_id', function (req, res, next) {
  var course_id = req.params.course_id;

  Course.get_course_activities(course_id, function(error, results) {
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
