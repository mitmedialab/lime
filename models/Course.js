// -------------------------------------------------------------------------- //
// The Courses Model                                                          //
// The ORM for mapping SQL database querries into a JavaScript module methods //
// -------------------------------------------------------------------------- //

//import moment for getting timestamps
var moment = require('moment');
//import pg to connect to the database 
var pg = require('pg');
//import the connection string for connecting to the database
var connectionString = require('../config/index').connectionString;

/**
 * creates a new course in the database
 * @param data an object with course attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.create_course = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO courses(title, source, description, image, course_link, chat_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
    [data.title, data.source, data.description, data.image, data.course_link, data.chat_link], function(err, result) {
      if(err) {
        done();
        console.log(err);
      } else {

        var query = client.query('SELECT * FROM courses WHERE id=($1);', [result['rows'][0]['id']]);

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
 * returns the course from the database if it exists and not deleted
 * @param id the id of the course to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_course = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM courses WHERE id=($1);', [id]);
    
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
 * returns all courses from the database that are not deleted
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_courses = function(cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM courses WHERE deleted=FALSE ORDER BY id ASC;');
    
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
 * updates a course in the database
 * @param id the id of the course to be updated 
 * @param data an object with the course attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_course = function(id, data, cb) {
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
      client.query('UPDATE courses SET title=($1) WHERE id=($2)',
      [data.title, id]);
    }

    if(data.source) {
      client.query('UPDATE courses SET source=($1) WHERE id=($2)',
      [data.source, id]);
    }

    if(data.description) {
      client.query('UPDATE courses SET description=($1) WHERE id=($2)',
      [data.description, id]);
    }

    if(data.image) {
      client.query('UPDATE courses SET image=($1) WHERE id=($2)',
      [data.image, id]);
    }

    if(data.course_link) {
      client.query('UPDATE courses SET course_link=($1) WHERE id=($2)',
      [data.course_link, id]);
    }

    if(data.chat_link) {
      client.query('UPDATE courses SET chat_link=($1) WHERE id=($2)',
      [data.chat_link, id]);
    }
    
    var query = client.query("SELECT * FROM courses WHERE id=($1);", [id]);

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
 * soft delete the specified course by setting its deleted attribute to true 
 * @param id the id of the course to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_course = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE courses SET deleted=($1) WHERE id=($2)',
      [true, id], function(err) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {

        var query = client.query('UPDATE users_courses SET deleted=($1) WHERE course_id=($2);', [true, id]);
        
        query.on('end', () => {
          var second_query = client.query('UPDATE activities SET deleted=($1) WHERE course_id=($2);', [true, id]);   
          second_query.on('end', () => {
            done();
            results = {id: id};
            cb(error, results);
          });
        });
      }
    });
  });  
}

/**
 * permenantly delete the specified course from the database
 * @param id the id of the course to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_course = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM courses WHERE id=($1)', [id], function(err) {
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
 * return all users associated with the specified course
 * @param course_id the id of the relevant course 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_course_users = function(course_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM users_courses WHERE course_id=($1) AND deleted=FALSE;', [course_id]);
    
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
 * return all activities associated with the specified course
 * @param course_id the id of the relevant course 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_course_activities = function(course_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM activities WHERE course_id=($1) AND deleted=FALSE;', [course_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}
