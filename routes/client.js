var router = require('express').Router();
var ClientHandler = require('../server/client-handler').ClientHandler;
var ChatroomsHandler = require('../server/chatroom').ChatroomsHandler;

// add a new memeber name for a given room 
router.post('/addMemberName', function(req, res) {
  var client = ClientHandler.getClient(req.body.userid);
  var callback = function() {
    var room = ChatroomsHandler.retrieveRoom(req.body.token);
    room.addNewRoomMember(client);
    res.send({ CODE: '200' });
  }
  client.addMemberNameForRoom(req.body.token, req.body.memberName, callback);
});

// fetch member name for a given room 
router.post('/getMemberName', function(req, res) {
  var client = ClientHandler.getClient(req.body.userid);
  var name = client.getMemberNameForRoom(req.body.token);
  if (name) {
    res.send({
      CODE: '200',
      params: { name: name }
    });
  }
  else {
    res.send({ CODE: '500' });
  }
});

module.exports = router;