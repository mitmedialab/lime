var moment = require('moment');
var express = require('express');
var path = require('path');
var router = express.Router();
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

//Create Course
router.post('/', (req, res, next) => {
  var results = [];

  var data = {
    title: req.body.title, 
    source: req.body.source, 
    description: req.body.description, 
    image: req.body.image,
    course_link: req.body.course_link,
    chat_link: req.body.chat_link
  };

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
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
          return res.json(results);
        });

    	}
    });
  });
});


//Read Course
router.get('/:course_id', (req, res, next) => {
  var results = [];

  var id = req.params.course_id;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM courses WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Read Courses
router.get('/', (req, res, next) => {
  var results = [];

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM courses ORDER BY id ASC;');
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Update Course
router.put('/:course_id', (req, res, next) => {
  var results = [];
  
  var id = req.params.course_id;
  
  var data = {
    title: req.body.title, 
    source: req.body.source, 
    description: req.body.description, 
    image: req.body.image,
    course_link: req.body.course_link,
    chat_link: req.body.chat_link
  };
  
  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
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
      return res.json(results);
    });
  });
});

//Delete Course
router.delete('/:course_id', (req, res, next) => {
  var results = [];
  
  var id = req.params.course_id;
  
  pg.connect(connectionString, (err, client, done) => {
    
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    client.query('DELETE FROM courses WHERE id=($1)', [id], function(err) {
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
