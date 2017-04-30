// ------------------------------------------------------ //
// The Activities Router                                  //
// The router handling all api cals to /api/v1/activities //
// ------------------------------------------------------ //

/** 
 * Express Imports
 * @import express the main express web framework
 * @import router the express router to handle api calls
 **/
var express = require('express');
var router = express.Router();

//Activities ORM for changing activities data
var Activity = require('../models/Activity');

//Create activity
router.post('/', function (req, res, next) {
  var data = {
    title: req.body.title,           
    description: req.body.description,     
    example: req.body.example,         
    image: req.body.image,           
    chat_link: req.body.chat_link,
    requirementsList: req.body.requirementsList,
    objectivesList: req.body.objectivesList,
    expert_id: req.body.expert_id,
    course_id: req.body.course_id
  }; 

  Activity.create_activity(data, function(error, results) {
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

//Read activities
router.get('/', function (req, res, next) {
  Activity.get_activities(function(error, results) {
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

//Update activity
router.put('/:activity_id', function (req, res, next) {
  var id = req.params.activity_id;
  
  var data = {
    title: req.body.title,           
    description: req.body.description,     
    example: req.body.example,         
    image: req.body.image, 
    chat_link: req.body.chat_link,
    requirementsList: req.body.requirementsList,
    objectivesList: req.body.objectivesList,          
    chat_link: req.body.chat_link,      
    expert_id: req.body.expert_id,
    course_id: req.body.course_id
  }; 
  
  Activity.update_activity(id, data, function(error, results) {
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

//Delete activity
router.delete('/:activity_id', function (req, res, next) {
  var id = req.params.activity_id;
  
  Activity.soft_delete_activity(id, function(error, results) {
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

//Create requirement
router.post('/requirements', function (req, res, next) {
  var data = {
    activity_id: req.body.activity_id,  
    description: req.body.description
  }; 

  Activity.add_activity_requirement(data, function(error, results) {
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

//Read activity requirements
router.get('/requirements/:activity_id', function (req, res, next) {
  var activity_id = req.params.activity_id;

  Activity.get_activity_requirements(activity_id, function(error, results) {
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

//Read requirements
router.get('/requirements/', function (req, res, next) {
  console.log('Im getting requirements');
  Activity.get_requirements(function(error, results) {
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

//Update requirement
router.put('/requirements/:requirement_id', function (req, res, next) {
  var id = req.params.requirement_id;
  
  var data = {  
    description: req.body.description
  };  
  
  Activity.update_requirement(id, data, function(error, results) {
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

//Delete requirement
router.delete('/requirements/:requirement_id', function (req, res, next) {
  var id = req.params.requirement_id;
  
  Activity.soft_delete_requirement(id, function(error, results) {
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

//Create objective
router.post('/objectives', function (req, res, next) {
  var data = {
    activity_id: req.body.activity_id,  
    description: req.body.description
  }; 

  Activity.add_activity_objective(data, function(error, results) {
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

//Read activity objectives
router.get('/objectives/:activity_id', function (req, res, next) {
  var activity_id = req.params.activity_id;

  Activity.get_activity_objectives(activity_id, function(error, results) {
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

//Read objectives
router.get('/objectives/', function (req, res, next) {
  Activity.get_objectives(function(error, results) {
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

//Update objective
router.put('/objectives/:objective_id', function (req, res, next) {
  var id = req.params.objective_id;
  
  var data = {
    description: req.body.description
  };  
  
  Activity.update_objective(id, data, function(error, results) {
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

//Delete objective
router.delete('/objectives/:objective_id', function (req, res, next) {
  var id = req.params.objective_id;
  
  Activity.soft_delete_objective(id, function(error, results) {
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

//Create submission
router.post('/submissions', function (req, res, next) {
  var data = {
    title: req.body.title,
    description: req.body.description,
    gitlab_link: req.body.gitlab_link,
    gdoc_link: req.body.gdoc_link,
    image: req.body.image,
    user_id: req.body.user_id,
    activity_id: req.body.activity_id
  };

  Activity.add_activity_submission(data, function(error, results) {
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

//Read activity submissions
router.get('/submissions/:activity_id', function (req, res, next) {
  var activity_id = req.params.activity_id;

  Activity.get_activity_submissions(activity_id, function(error, results) {
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

//Read submissions
router.get('/submissions/', function (req, res, next) {
  Activity.get_submissions(function(error, results) {
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

//Update submission
router.put('/submissions/:submission_id', function (req, res, next) {
  var id = req.params.submission_id;
  
  var data = {
    title: req.body.title,
    description: req.body.description,
    gitlab_link: req.body.gitlab_link,
    gdoc_link: req.body.gdoc_link,
    image: req.body.image,
    user_id: req.body.user_id
  };
  
  Activity.update_submission(id, data, function(error, results) {
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

//Delete submission
router.delete('/submissions/:submission_id', function (req, res, next) {
  var id = req.params.submission_id;
  
  Activity.soft_delete_submission(id, function(error, results) {
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

//Read activity
router.get('/:activity_id', function (req, res, next) {
  var id = req.params.activity_id;

  Activity.get_activity(id, function(error, results) {
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
