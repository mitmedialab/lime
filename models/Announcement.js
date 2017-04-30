// -------------------------------------------------------------------------- //
// The Announcements Model                                                    //
// The ORM for mapping SQL database querries into a JavaScript module methods //
// -------------------------------------------------------------------------- //

//import moment for getting timestamps
var moment = require('moment');
//import pg to connect to the database 
var pg = require('pg');
//import the connection string for connecting to the database
var connectionString = require('../config/index').connectionString;

/**
 * creates a new announcement in the database
 * @param data an object with announcement attributes
 * @param cb a callback function to be called once the database returns
 **/
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

/**
 * returns the announcement from the database if it exists and not deleted
 * @param id the id of the announcement to be fetched
 * @param cb a callback function to be called once the database returns
 **/
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

/**
 * returns all announcements from the database that are not deleted
 * @param cb a callback function to be called once the database returns
 **/
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

    var query = client.query('SELECT * FROM announcements WHERE deleted=FALSE ORDER BY id ASC;');
    
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
 * updates an announcement in the database
 * @param id the id of the announcement to be updated 
 * @param data an object with the announcement attributes to be updated
 * @param cb a callback function to be called once the database returns
 **/
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

/**
 * soft delete the specified announcement by setting its deleted attribute to true 
 * @param id the id of the announcement to be soft deleted 
 * @param cb a callback function to be called once the database returns
 **/
module.exports.soft_delete_announcement = function(id, cb) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    
    if(err) {
      done();
      console.log(err);
      error = err;
      cb(error, results);
    }

    client.query('UPDATE announcements SET deleted=($1) WHERE id=($2)',
      [true, id], function(err) {
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
 * permenantly delete the specified announcement from the database
 * @param id the id of the announcement to be deleted 
 * @param cb a callback function to be called once the database returns
 **/
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
