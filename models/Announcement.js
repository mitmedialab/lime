var moment = require('moment');
var pg = require('pg');
var connectionString = require('../config/index').connectionString;

module.exports.create_announcement = function(data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('INSERT INTO announcements(header, message, timestamp, user_id) VALUES ($1, $2, $3, $4) RETURNING id;',
    [data.header, data.message, moment().format('LLLL'), data.user_id], function(err, result) {

      if(err) {
        done();
        console.log(err);
        error = err;
        cb(error, results);
      } else {

        var query = client.query('SELECT * FROM announcements WHERE id=($1);', [result['rows'][0]['id']]);

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

module.exports.get_announcement = function(id, cb) {
  var results = null;
  var error = null; 

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM announcements WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  }); 
}

module.exports.get_announcements = function(cb) {
  var results = [];
  var error = null;  

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    var query = client.query('SELECT * FROM announcements ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      cb(error, results);
    });
  });
}

module.exports.update_announcement = function(id, data, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    if(data.header) {
      client.query('UPDATE announcements SET header=($1) WHERE id=($2)',
      [data.header, id]);
    }

    if(data.message) {
      client.query('UPDATE announcements SET message=($1) WHERE id=($2)',
      [data.message, id]);
    }

    if(data.user_id) {
      client.query('UPDATE announcements SET user_id=($1) WHERE id=($2)',
      [data.user_id, id]);
    }

    client.query('UPDATE announcements SET timestamp=($1) WHERE id=($2)',
    [moment().format('LLLL'), id]);
    
    var query = client.query('SELECT * FROM announcements WHERE id=($1);', [id]);

    query.on('row', (row) => {
      console.log(row);
      results = row;
    });

    query.on('end', () => {
      done();
      cb(error, results);
    });
  });  
}

module.exports.delete_announcement = function(id, cb) {
  var results = null;
  var error = null;  

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }
    
    client.query('DELETE FROM announcements WHERE id=($1)', [id], function(err) {
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
