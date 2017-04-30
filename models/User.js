// -------------------------------------------------------------------------- //
// The Users Model                                                            //
// The ORM for mapping SQL database querries into a JavaScript module methods //
// -------------------------------------------------------------------------- //

//import moment for getting timestamps
var moment = require('moment');
//import pg to connect to the database 
var pg = require('pg');
//import the connection string for connecting to the database
var connectionString = require('../config/index').connectionString;

/**
 * creates a new user in the database
 * @param data an object with user attributes
 * @param cb a callback function to be called once the database returns
 **/
module.exports.create_user = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    console.log('about', data.about);
    client.query('INSERT INTO users(gitlab_access_token, gitter_access_token, github_access_token, id, name, affiliation, about, role, image, portfolio, chat_link) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;',
    [data.gitlab_access_token, data.gitter_access_token, data.github_access_token, data.id, data.name, data.affiliation, data.about, data.role, data.image, data.portfolio, data.chat_link], function(err, result) {
      if(err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        var query = client.query('SELECT * FROM users WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
          console.log(results);
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
 * returns the user from the database if it exists and not deleted
 * @param id the id of the user to be fetched
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_user = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM users WHERE id=($1);', [id]);
    
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
 * returns all users from the database that are not deleted
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_users = function(cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM users WHERE deleted=FALSE ORDER BY id ASC;');
    
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
 * updates a user in the database
 * @param id the id of the user to be updated 
 * @param data an object with the user attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
module.exports.update_user = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.gitter_access_token) {
      client.query('UPDATE users SET gitter_access_token=($1) WHERE id=($2);',
      [data.gitter_access_token, id]);
    }

    if(data.name) {
      client.query('UPDATE users SET name=($1) WHERE id=($2);',
      [data.name, id]);
    }

    if(data.affiliation) {
      client.query('UPDATE users SET affiliation=($1) WHERE id=($2);',
      [data.affiliation, id]);
    }

    if(data.about) {
      client.query('UPDATE users SET about=($1) WHERE id=($2);',
      [data.about, id]);
    }

    if(data.role) {
      console.log('Hello');
      client.query('UPDATE users SET role=($1) WHERE id=($2);',
      [data.role, id]);
      console.log('The Query was executed');
    }

    if(data.image) {
      client.query('UPDATE users SET image=($1) WHERE id=($2);',
      [data.image, id]);
    }

    if(data.portfolio) {
      client.query('UPDATE users SET portfolio=($1) WHERE id=($2);',
      [data.portfolio, id]);
    }

    if(data.chat_link) {
      client.query('UPDATE users SET chat_link=($1) WHERE id=($2);',
      [data.chat_link, id]);
    }
    
    var query = client.query("SELECT * FROM users WHERE id=($1);", [id]);

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
 * soft delete the specified user by setting its deleted attribute to true 
 * @param id the id of the user to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_user = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE users SET deleted=($1) WHERE id=($2)',
      [true, id], function(err) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        var query = client.query('UPDATE users_courses SET deleted=($1) WHERE user_id=($2);', [true, id]);
        
        query.on('end', () => {
          var second_query = client.query('UPDATE activities SET deleted=($1) WHERE expert_id=($2);', [true, id]);   
          second_query.on('end', () => {
            var third_query = client.query('UPDATE announcements SET deleted=($1) WHERE user_id=($2);', [true, id]);

            third_query.on('end', () => {
              var fourth_query = client.query('UPDATE submissions SET deleted=($1) WHERE user_id=($2);', [true, id]);

              fourth_query.on('end', () => {
                done();
                results = {id: id};
                cb(error, results);
              });
            });
          });
        });
      }
    });
  });  
}

/**
 * permenantly delete the specified user from the database
 * @param id the id of the user to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.delete_user = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM users WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {
        done();
        results = {id: id};
        cb(error, results);
      }
    });
  });
}

/**
 * associate the specified course with the specified user
 * @param data an object including the course and user ids
 * @param cb a callback function to be called once the database returns
 **/
module.exports.add_course_to_user = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO users_courses(course_id, user_id) values($1, $2);',
    [data.course_id, data.user_id], function(err, result) {
      if(err) {
        done();
        console.log(err);
        cb(error, results);
      } else {
        var query = client.query('SELECT * FROM users_courses WHERE course_id=($1);', [data.course_id]);

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
 * return all courses associated with the specified user
 * @param user_id the id of the relevant user 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_user_courses = function(user_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM users_courses WHERE user_id=($1) AND deleted=FALSE;', [user_id]);
    
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
 * return all submissions associated with the specified user
 * @param user_id the id of the relevant user 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.get_user_submissions = function(user_id, cb) {
  var results = [];
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM submissions WHERE user_id=($1) AND deleted=FALSE;', [user_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

