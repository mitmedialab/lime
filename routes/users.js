var express = require('express');
var router = express.Router();
var User = require('../models/User');

//Create User
router.post('/', function (req, res, next) {
  var data = {
    github_access_token: req.body.github_access_token,
    gitter_access_token: req.body.gitter_access_token,
    id: req.body.id, 
    name: req.body.name, 
    affiliation: req.body.affiliation, 
    about: req.body.about, 
    role: req.body.role, 
    image: req.body.image,
    portfolio: req.body.portfolio,
    chat_link: req.body.chat_link
  };

  User.create_user(data, function(error, results) {
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

//Read Users
router.get('/current', function (req, res, next) {
  console.log('req.session.passport.user.id');
  // return res.status(500).json({success: false, data: 'Not Authenticated'});
  // console.log(req.session.passport.user.id);
  if (req.session.passport == undefined) {
    // return res.json({user_id: '5400684'});
    return res.status(500).json({success: false, data: 'Not Authenticated'});
  } else {
    return res.json({user_id: req.session.passport.user.id});
  }

});

//Read User
router.get('/:user_id', function (req, res, next) {
  var results = [];

  var id = req.params.user_id;

  User.get_user(id, function(error, results) {
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

//Read Users
router.get('/', function (req, res, next) {
  User.get_users(function(error, results) {
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

//Update User
router.put('/:user_id', function (req, res, next) {
  var id = req.params.user_id;
  
  var data = {
    name: req.body.name, 
    affiliation: req.body.affiliation, 
    about: req.body.about, 
    role: req.body.role, 
    image: req.body.image,
    portfolio: req.body.portfolio,
    chat_link: req.body.chat_link
  };

  User.update_user(id, data, function(error, results) {
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

//Delete User
router.delete('/:user_id', function (req, res, next) {
  var id = req.params.user_id;
  
  User.delete_user(id, function(error, results) {
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

//Add Course
router.post('/courses/', function (req, res, next) {
  var data = {
    course_id: req.body.course_id,
    user_id: req.body.user_id
  };

  User.add_course_to_user(data, function(error, results) {
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

//Read courses
router.get('/courses/:user_id', function (req, res, next) {
  var user_id = req.params.user_id;

  User.get_user_courses(user_id, function(error, results) {
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
