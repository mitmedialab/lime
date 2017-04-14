var request = require('request');
var axios = require('axios');
var Gitter = require('node-gitter');

/**
 *
 * Gitter APIs To Be Added (DB needs to be updated to support these)
 *
 * Create New Room
 * Add user to room
 * Add user to community/group
 * Post in Lobby whenever there is an announcement => at announcement dispatch (need admin page)
 * Course Channel (can't create it by default) => manually create for all added classes => add set of classes to db
 * Add personal portfolio link => link to portfolio 
 * Add link to direct message => https://gitter.im/benbitdiddle12 (github username)
 * 
**/

// function make_request(method, path, token, data, cb) {
//   var options = {
//     method: method,
//     url: 'https://gitter.im' + path,
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Bearer ' + token
//     },
//     data: data
//   };

//   axios(options)
//   .then(function(res) {
//     console.log('axios success');
//     console.log(res.data);
//     cb(null, res.data);
//   }).catch(function(err) {
//     console.log('axios error');
//     console.log(err);
//     cb(err, null);    
//   });     
// }

module.exports.get_user_id = function(token, cb) {
  var gitter = new Gitter(token);

  gitter.currentUser()
  .then(function(user) {
    console.log('You are logged in as ', user.username);
    cb(null, {id: user.id});
  })
  .catch(function (err) {
    console.log(err);
    cb(err, null);
  });
}

module.exports.add_user_to_room = function(token, room, cb) {
  var gitter = new Gitter(token);

  gitter.rooms.join('ML-LIME/'+room)
  .then(function(room) {
    console.log('Joined room ', room.name);
    cb(null, {id: room.id});
  })
  .catch(function (err) {
    console.log(err);
    cb(err, null);
  });
}

//not tested
module.exports.post_message_to_room = function(token, room, message, cb) {
  var gitter = new Gitter(token);

  gitter.rooms.join('ML-LIME/'+room)
  .then(function(room) {
    room.send(message);
    cb(null, {id: room.id});
  })
  .catch(function (err) {
    console.log(err);
    cb(err, null);
  });
}

//not tested
module.exports.listen_to_room = function(token, roomId, message, cb) {
  var gitter = new Gitter(token);

  gitter.rooms.find(roomId)
  .then(function(room) {
    var events = room.streaming().chatMessages();
   
    // The 'snapshot' event is emitted once, with the last messages in the room 
    events.on('snapshot', function(snapshot) {
      console.log(snapshot.length + ' messages in the snapshot');
    });
   
    // The 'chatMessages' event is emitted on each new message 
    events.on('chatMessages', function(message) {
      console.log('A message was ' + message.operation);
      console.log('Text: ', message.model.text);
    });
  })
  .catch(function (err) {
    console.log(err);
    cb(err, null);
  });
}
