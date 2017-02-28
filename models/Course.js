var moment = require('moment');
var pg = require('pg');
var connectionString = require('../config/index').connectionString;

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

    var query = client.query('SELECT * FROM courses ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

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

    var query = client.query('SELECT * FROM users_courses WHERE course_id=($1);', [course_id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}
