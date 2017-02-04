var moment = require('moment');
var express = require('express');
var path = require('path');
var router = express.Router();
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

//Create Announcement
router.post('/', (req, res, next) => {
  var results = {};

  var data = {
  	header: req.body.header, 
  	message: req.body.message, 
  	user_id: req.body.user_id
  };

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query('INSERT INTO announcements(header, message, timestamp, user_id) VALUES ($1, $2, $3, $4) RETURNING id;',
    [data.header, data.message, moment().format('LLLL'), data.user_id], function(err, result) {

    	if(err) {
    		done();
    		console.log(err);
    	} else {

        var query = client.query('SELECT * FROM announcements WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
          return res.json(results);
        });

    	}

    });
  });
});

//Read Announcement
router.get('/:announcement_id', (req, res, next) => {
  var results = [];

  var id = req.params.announcement_id;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM announcements WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Read Announcements
router.get('/', (req, res, next) => {
  var results = [];

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM announcements ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Update Announcement
router.put('/:announcement_id', (req, res, next) => {
  var results = [];
  
  var id = req.params.announcement_id;
  
  var data = {
  	header: req.body.header, 
  	message: req.body.message, 
  	user_id: req.body.user_id
  };
  
  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
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
      return res.json(results);
    });
  });
});

//Delete Announcement
router.delete('/:announcement_id', (req, res, next) => {
  var results = [];
  
  var id = req.params.announcement_id;
  
  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    client.query('DELETE FROM announcements WHERE id=($1)', [id], function(err) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      } else {
        done();
        return res.json({id: id});
      }
    });
  });
});

module.exports = router;
