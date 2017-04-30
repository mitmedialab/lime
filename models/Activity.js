// -------------------------------------------------------------------------- //
// The Activity Model                                                         //
// The ORM for mapping SQL database querries into a JavaScript module methods //
// -------------------------------------------------------------------------- //

//import moment for getting timestamps
var moment = require('moment');
//import pg to connect to the database 
var pg = require('pg');
//import the connection string for connecting to the database
var connectionString = require('../config/index').connectionString;

/**
 * creates a new activity in the database and adds its requirements and objectives
 * @param data an object with activity attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.create_activity = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO activities(title, description, image, chat_link, timestamp, expert_id, course_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;',
    [data.title, data.description, data.image, data.chat_link, moment().format('LLLL'), data.expert_id, data.course_id], function(err, result) {
      if(err) {
        done();
        console.log(err);
      } else {

        if (data.requirementsList && data.requirementsList.length>0) {
          data.requirementsList.forEach(function(req_description) {
            module.exports.add_activity_requirement({description: req_description, activity_id: parseInt([result['rows'][0]['id']], 10)}, function() {return});
          });
        }

        if (data.objectivesList && data.objectivesList.length>0) {
          data.objectivesList.forEach(function(obj_description) {
            module.exports.add_activity_objective({description: obj_description, activity_id: parseInt([result['rows'][0]['id']], 10)}, function() {return});
          });
        }

        var query = client.query('SELECT * FROM activities WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
          cb(error, results);
        });

      }
    });
  });
}

/**
 * returns the activity from the database if it exists and not deleted
 * @param id the id of the activity to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_activity = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM activities WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns all activities from the database that are not deleted
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_activities = function(cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM activities WHERE deleted=FALSE ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * updates an activity in the database and adds its requirements and objectives
 * @param id the id of the activity to be updated 
 * @param data an object with the activity attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_activity = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.title) {
      client.query('UPDATE activities SET title=($1) WHERE id=($2)',
      [data.title, id]);
    }

    if(data.description) {
      client.query('UPDATE activities SET description=($1) WHERE id=($2)',
      [data.description, id]);
    }

    if(data.image) {
      client.query('UPDATE activities SET image=($1) WHERE id=($2)',
      [data.image, id]);
    }

    if(data.chat_link) {
      client.query('UPDATE activities SET chat_link=($1) WHERE id=($2)',
      [data.chat_link, id]);
    }

    if(data.expert_id) {
      client.query('UPDATE activities SET expert_id=($1) WHERE id=($2)',
      [data.expert_id, id]);
    }

    if(data.course_id) {
      client.query('UPDATE activities SET course_id=($1) WHERE id=($2)',
      [data.course_id, id]);
    }

    client.query('UPDATE activities SET timestamp=($1) WHERE id=($2)',
    [moment().format('LLLL'), id]);

    if(data.requirementsList && data.requirementsList.length>0) {
      module.exports.soft_delete_activity_requirements(id, function(err, results) {
        data.requirementsList.forEach(function(req_description) {
          module.exports.add_activity_requirement({description: req_description, activity_id: parseInt(id, 10)}, function() {return});
        });
      })
    }

    if(data.objectivesList && data.objectivesList.length>0) {
      module.exports.soft_delete_activity_objectives(id, function(err, results) {
        data.objectivesList.forEach(function(obj_description) {
          module.exports.add_activity_objective({description: obj_description, activity_id: parseInt(id, 10)}, function() {return});
        });
      })
    }
    
    var query = client.query("SELECT * FROM activities WHERE id=($1);", [id]);

    query.on('row', (row) => {
      results = row;
    });

    query.on('end', function() {
      done();
      cb(error, results);
    });
  });
}

/**
 * soft delete the specified activity by setting its deleted attribute to true 
 * @param id the id of the activity to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_activity = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE activities SET deleted=($1) WHERE id=($2)',
      [true, id], function(err) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        var query = client.query('UPDATE requirements SET deleted=($1) WHERE activity_id=($2);', [true, id]);
        
        query.on('end', () => {
          var second_query = client.query('UPDATE objectives SET deleted=($1) WHERE activity_id=($2);', [true, id]);   
          second_query.on('end', () => {
            var third_query = client.query('UPDATE submissions SET deleted=($1) WHERE activity_id=($2);', [true, id]);

            third_query.on('end', () => {
              done();
              results = {id: id};
              cb(error, results);
            });
          });
        });
      }
    });
  });  
}

/**
 * permenantly delete the specified activity from the database
 * @param id the id of the activity to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_activity = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM activities WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      } else {
        done();
        results = {id: id};
        cb(error, results);
      }
    });   
  });
}

/**
 * creates a new requirement associdated with the specified activity
 * @param data an object with requirement attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.add_activity_requirement = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO requirements(description, activity_id) VALUES ($1, $2) RETURNING id;',
    [data.description, data.activity_id], function(err, result) {
      if(err) {
        done();
        console.log(err);
      } else {

        var query = client.query('SELECT * FROM requirements WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
          cb(error, results);
        });
      }
    });
  });
}

/**
 * soft deletes all requirements associated with the specified activity
 * @param id the id of the activity whose requirements are to be soft deleted
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_activity_requirements = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE requirements SET deleted=($1) WHERE activity_id=($2) RETURNING activity_id;',
      [true, id], function(err, results) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        cb(error, results);
      }
    });
  });  
}

/**
 * returns all requirements belonging to the specified activity from the database
 * @param activity_id the id of the activity whose requirements are to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_activity_requirements = function(activity_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM requirements WHERE deleted=FALSE AND activity_id=($1);', [activity_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns the specified requirement from the database
 * @param id the id of the requirement to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_requirement = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM requirements WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns all requirements from the database
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_requirements = function(cb) {
  var results = [];
  var error = null;

  console.log('Im in the model getting requirements');
  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM requirements WHERE deleted=FALSE ORDER BY id ASC;');
    
    query.on('row', (row) => {
      console.log('I fetched a requirement');
      console.log('row ', row);
      results.push(row);
    });
    
    query.on('end', () => {
      console.log('Im done fetching requirements');
      done();
      cb(error, results);
    });
  });
}

/**
 * updates the specified requirement in the database
 * @param id the id of the requirement to be updated
 * @param data an object with the requirement attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_requirement = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.description) {
      client.query('UPDATE requirements SET description=($1) WHERE id=($2)',
      [data.description, id]);
    }
    
    var query = client.query("SELECT * FROM requirements WHERE id=($1);", [id]);

    query.on('row', (row) => {
      results = row;
    });

    query.on('end', function() {
      done();
      cb(error, results);
    });
  });
}

/**
 * soft delete the specified requirement by setting its deleted attribute to true 
 * @param id the id of the requirement to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_requirement = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE requirements SET deleted=($1) WHERE id=($2) RETURNING activity_id;',
      [true, id], function(err, results) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        results = {
          id: id,
          activity_id: [results['rows'][0]['activity_id']]
        };
        cb(error, results);
      }
    });
  });  
}

/**
 * permenantly delete the specified requirement from the database 
 * @param id the id of the requirement to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_requirement = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM requirements WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      } else {
        done();
        results = {id: id};
        cb(error, results);
      }
    });   
  });
}

/**
 * creates a new objective associdated with the specified activity
 * @param data an object with objective attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.add_activity_objective = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO objectives(description, activity_id) VALUES ($1, $2) RETURNING id;',
    [data.description, data.activity_id], function(err, result) {
      if(err) {
        done();
        console.log(err);
      } else {

        var query = client.query('SELECT * FROM objectives WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
          cb(error, results);
        });
      }
    });
  });
}

/**
 * soft deletes all objectives associated with the specified activity
 * @param id the id of the activity whose objectives are to be soft deleted
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_activity_objectives = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE objectives SET deleted=($1) WHERE activity_id=($2) RETURNING activity_id;',
      [true, id], function(err, results) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        cb(error, results);
      }
    });
  });  
}

/**
 * returns all objectives belonging to the specified activity from the database
 * @param activity_id the id of the activity whose objectives are to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_activity_objectives = function(activity_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM objectives WHERE deleted=FALSE AND activity_id=($1);', [activity_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns the specified objective from the database
 * @param id the id of the objective to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_objective = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM objectives WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns all objectives from the database
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_objectives = function(cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM objectives WHERE deleted=FALSE ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * updates the specified objective in the database
 * @param id the id of the objective to be updated
 * @param data an object with the objective attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_objective = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.description) {
      client.query('UPDATE objectives SET description=($1) WHERE id=($2)',
      [data.description, id]);
    }
    
    var query = client.query("SELECT * FROM objectives WHERE id=($1);", [id]);

    query.on('row', (row) => {
      results = row;
    });

    query.on('end', function() {
      done();
      cb(error, results);
    });
  });
}

/**
 * soft delete the specified objective by setting its deleted attribute to true 
 * @param id the id of the objective to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_objective = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE objectives SET deleted=($1) WHERE id=($2) RETURNING activity_id;',
      [true, id], function(err, results) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        results = {
          id: id,
          activity_id: [results['rows'][0]['activity_id']]
        };
        cb(error, results);
      }
    });
  });  
}

/**
 * permenantly delete the specified objective from the database 
 * @param id the id of the objective to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_objective = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM objectives WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      } else {
        done();
        results = {id: id};
        cb(error, results);
      }
    });   
  });
}

/**
 * creates a new submission associdated with the specified activity
 * @param data an object with submission attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.add_activity_submission = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO submissions(title, description, gitlab_link, gdoc_link, image, timestamp, user_id, activity_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;',
    [data.title, data.description, data.gitlab_link, data.gdoc_link, data.image, moment().format('LLLL'), data.user_id, data.activity_id], function(err, result) {
      if(err) {
        done();
        console.log(err);
      } else {

        var query = client.query('SELECT * FROM submissions WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
          cb(error, results);
        });
      }
    });
  });
}

/**
 * returns all submissions belonging to the specified activity from the database
 * @param activity_id the id of the activity whose submissions are to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_activity_submissions = function(activity_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM submissions WHERE deleted=FALSE AND activity_id=($1);', [activity_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns the specified submission from the database
 * @param id the id of the submission to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_submission = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM submissions WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * returns all submissions from the database
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_submissions = function(cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM submissions WHERE deleted=FALSE ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

/**
 * updates the specified submission in the database
 * @param id the id of the submission to be updated
 * @param data an object with the submission attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_submission = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.title) {
      client.query('UPDATE submissions SET title=($1) WHERE id=($2)',
      [data.title, id]);
    }

    if(data.description) {
      client.query('UPDATE submissions SET description=($1) WHERE id=($2)',
      [data.description, id]);
    }

    if(data.gitlab_link) {
      client.query('UPDATE submissions SET gitlab_link=($1) WHERE id=($2)',
      [data.gitlab_link, id]);
    }

    if(data.gdoc_link) {
      client.query('UPDATE submissions SET gdoc_link=($1) WHERE id=($2)',
      [data.gdoc_link, id]);
    }

    if(data.screenshot) {
      client.query('UPDATE submissions SET image=($1) WHERE id=($2)',
      [data.image, id]);
    }

    if(data.user_id) {
      client.query('UPDATE submissions SET user_id=($1) WHERE id=($2)',
      [data.user_id, id]);
    }

    if(data.activity_id) {
      client.query('UPDATE submissions SET activity_id=($1) WHERE id=($2)',
      [data.activity_id, id]);
    }

    client.query('UPDATE submissions SET timestamp=($1) WHERE id=($2)',
    [moment().format('LLLL'), id]);
    
    var query = client.query("SELECT * FROM submissions WHERE id=($1);", [id]);

    query.on('row', (row) => {
      results = row;
    });

    query.on('end', function() {
      done();
      cb(error, results);
    });
  });
}

/**
 * soft delete the specified submission by setting its deleted attribute to true 
 * @param id the id of the submission to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_submission = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE submissions SET deleted=($1) WHERE id=($2) RETURNING activity_id;',
      [true, id], function(err, results) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        results = {
          id: id,
          activity_id: [results['rows'][0]['activity_id']]
        };
        cb(error, results);
      }
    });
  });  
}

/**
 * permenantly delete the specified submission from the database 
 * @param id the id of the submission to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_submission = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM submissions WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      } else {
        done();
        results = {id: id};
        cb(error, results);
      }
    });   
  });
}
