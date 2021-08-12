var router = require('express').Router();
var chatroom = require('../server/chatroom');
var Chatroom = chatroom.Chatroom;
var ChatroomsHandler = chatroom.ChatroomsHandler;
var ClientHandler = require('../server/client-handler').ClientHandler;

function generateRoomToken() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = [];
  var random = require('crypto').randomBytes(6);
  for (let i = 0; i < 6; i++) {
    token.push(chars[random[i] % chars.length]);
  }
  return token.join('');
}

// handle join room request
router.all('/join', function(req, res) {
  var code = req.body.roomCode;
  var client = ClientHandler.getClient(req.body.userid);
  var room = ChatroomsHandler.retrieveRoom(code);
  var message = {};
  var code;
  // if room exists
  if (room) {
    // check if the client already had room on list 
    if (!client.hasRoomOnList(code)) {
      // register client to the room 
      room.addNewRoomMember(client);
      client.addNewRoomToList(room);
      code = '200';
      message.type = 'success';
      message.text = 'You have joined the room!';
    }
    // if client has joined this room before
    else {
      code = '500';
      message.type = 'error';
      message.text = 'You have already had this room on your list';
    }
  }
  // if the room token is invalid
  else {
    code = '500';
    message.type = 'error';
    message.text = 'The room doesn\'t exist.'
  }
  res.send({
    CODE: code,
    params: { message: message }
  });
});


// handle make new room request
router.all('/new', function(req, res) {
  var name = req.body.chatroomName;
  var client = ClientHandler.getClient(req.body.userid);
  if (client) {
    ChatroomsHandler.validateNewRoomRegistration(client, name, function(response) {
      var code;
      var parameters = {};
      // if the new room is valid, generate room token and register the room 
      if (response.valid) {
        let roomToken = generateRoomToken();
        let room = new Chatroom(name, roomToken, client);
        ChatroomsHandler.registerNewRoom(room);
        client.addNewOwnerRoom(room);
        code = '200';
        parameters = {
          roomToken: roomToken,
          message: { type: 'success', text: 'The new room is successfully created!' }
        }
      }
      else {
        code = '500';
        parameters = {
          message: { type: 'error', text: response.message }
        }
      }
      res.send({
        CODE: code,
        params: parameters
      });
    });
  }
  // TODO: error handler
  else {
    res.send({});
  }
})

// fetch room memebers 
router.post('/members', function(req, res) {
  var token = req.body.token;
  var room = ChatroomsHandler.retrieveRoom(token);
  var list = room.getAllMemberNames(token);
  if (list.length > 0) {
    res.send({
      CODE: '200',
      params: { members: list }
    });
  }
  else {
    res.send({ CODE: '500' });
  }
});

module.exports = router;