var moment = require('moment');
var pg = require('pg');
var connectionString = require('../config/index');

module.exports.create_user = function(data) {
  var results = null;
  var error = null;

  pg.connect(connectionString, function (err, client, done) {
    if(err) {
      done();
      console.log(err);
      error = err;
    }

    client.query('INSERT INTO users(accessToken, id, name, affiliation, about, role, image, portfolio, chat_link) values($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;',
    [data.accessToken, data.id, data.name, data.affiliation, data.about, data.role, data.image, data.portfolio, data.chat_link], function(err, result) {
      if(err) {
        done();
        error = err;
      } else {
        var query = client.query('SELECT * FROM users WHERE id=($1);', [result['rows'][0]['id']]);

        query.on('row', (row) => {
          results = row;
        });

        query.on('end', () => {
          done();
        });
      }
    });
  });

  return {
    results: results,
    error: error
  }
}

module.exports.get_user = function(id) {
  var results = null;
  var error = null;

  pg.connect(connectionString, (err, client, done) => {

    if(err) {
      done();
      console.log(err);
      error = err;
    }

    var query = client.query('SELECT * FROM users WHERE id=($1);', [id]);
    
    query.on('row', (row) => {
      results = row;
    });
    
    query.on('end', () => {
      done();
    });
  });

  return {
    results: results,
    error: error
  }

}

// //Read Users
// router.get('/', (req, res, next) => {
//   var results = [];

//   pg.connect(connectionString, (err, client, done) => {

//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }

//     var query = client.query('SELECT * FROM users ORDER BY id ASC;');
    
//     query.on('row', (row) => {
//       results.push(row);
//     });
    
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });

// //Update User
// router.put('/:user_id', (req, res, next) => {
//   var results = [];
  
//   var id = req.params.user_id;
  
//   var data = {
//     name: req.body.name, 
//     affiliation: req.body.affiliation, 
//     about: req.body.about, 
//     role: req.body.role, 
//     image: req.body.image,
//     portfolio: req.body.portfolio,
//     chat_link: req.body.chat_link
//   };
  
//   pg.connect(connectionString, (err, client, done) => {
    
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }

//     if(data.name) {
//       client.query('UPDATE users SET name=($1) WHERE id=($2)',
//       [data.name, id]);
//     }

//     if(data.affiliation) {
//       client.query('UPDATE users SET affiliation=($1) WHERE id=($2)',
//       [data.affiliation, id]);
//     }

//     if(data.about) {
//       client.query('UPDATE users SET about=($1) WHERE id=($2)',
//       [data.about, id]);
//     }

//     if(data.role) {
//       client.query('UPDATE users SET role=($1) WHERE id=($2)',
//       [data.role, id]);
//     }

//     if(data.image) {
//       client.query('UPDATE users SET image=($1) WHERE id=($2)',
//       [data.image, id]);
//     }

//     if(data.portfolio) {
//       client.query('UPDATE users SET portfolio=($1) WHERE id=($2)',
//       [data.portfolio, id]);
//     }

//     if(data.chat_link) {
//       client.query('UPDATE users SET chat_link=($1) WHERE id=($2)',
//       [data.chat_link, id]);
//     }
    
//     var query = client.query("SELECT * FROM users WHERE id=($1);", [id]);

//     query.on('row', (row) => {
//       results = row;
//     });

//     query.on('end', function() {
//       done();
//       return res.json(results);
//     });
//   });
// });

// //Delete User
// router.delete('/:user_id', (req, res, next) => {
//   var results = [];
  
//   var id = req.params.user_id;
  
//   pg.connect(connectionString, (err, client, done) => {
    
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
    
//     client.query('DELETE FROM users WHERE id=($1)', [id], function(err) {
//       if (err) {
//         done();
//         console.log(err);
//         return res.status(500).json({success: false, data: err});
//       } else {
//         done();
//         return res.json({id: id});
//       }
//     });
//   });
// });

// //Add Course
// router.post('/courses/', (req, res, next) => {
//   var results = [];

//   var data = {
//     course_id: req.body.course_id,
//     user_id: req.body.user_id
//   };

//   pg.connect(connectionString, (err, client, done) => {

//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }

//     client.query('INSERT INTO users_courses(course_id, user_id) values($1, $2);',
//     [data.course_id, data.user_id], function(err, result) {
//       if(err) {
//         done();
//         console.log(err);
//       } else {
//         var query = client.query('SELECT * FROM users_courses WHERE course_id=($1);', [data.course_id]);

//         query.on('row', (row) => {
//           results = row;
//         });

//         query.on('end', () => {
//           done();
//           console.log(results);
//           return res.json(results);
//         });
//       }
//     });
//   });
// });

// //Read courses
// router.get('/courses/:user_id', (req, res, next) => {
//   var results = [];

//   var user_id = req.params.user_id;

//   pg.connect(connectionString, (err, client, done) => {

//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }

//     var query = client.query('SELECT * FROM users_courses WHERE user_id=($1);', [user_id]);
    
//     query.on('row', (row) => {
//       results.push(row);
//     });
    
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });

// module.exports = router;
