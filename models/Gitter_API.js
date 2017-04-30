// ------------------------------------------------------------------ //
// The Gitter Model                                                   //
// The model for mapping gitter APIs into a JavaScript module methods //
// ------------------------------------------------------------------ //

//import node-gitter for making gitter api calls
var Gitter = require('node-gitter');

/**
 * returns the user gitter id for the user with the specified token 
 * @param token the user gitter token to make gitter api calls on their behalf
 * @param cb a callback function to be called once the gitter api returns
 **/
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

/**
 * adds the specified user to the specified room 
 * @param token the user gitter token to make gitter api calls on their behalf
 * @param room the name of the room in the ML-LIME gitter community
 * @param cb a callback function to be called once the gitter api returns
 **/
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

/**
 * posts a message in a gitter room on a users behalf
 * @param token the user gitter token to make gitter api calls on their behalf
 * @param room the name of the room in the ML-LIME gitter community
 * @param message the message to be posted in the specified room
 * @param cb a callback function to be called once the gitter api returns
 **/
//NOT TESTED OR USED 
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

/**
 * returns a log of the messages in a room
 * @param token the user gitter token to make gitter api calls on their behalf
 * @param roomId the id of a room in the ML-LIME gitter community
 * @param cb a callback function to be called once the gitter api returns
 **/
//NOT TESTED OR USED 
module.exports.listen_to_room = function(token, roomId, cb) {
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
