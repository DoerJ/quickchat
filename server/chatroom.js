var Chatroom = function(name, token, owner) {
  this.roomName = name;
  this.id = token; 
  this.owner = owner;
  this.members = new Map();
  this.historyMessages = [];
}

Chatroom.prototype.addNewRoomMember = function(client) {
  var userid = client.id;
  if (!this.members.get(userid)) {
    this.members.set(userid, client);
  }
}

Chatroom.prototype.removeRoomMember = function(userid) {
  this.memebers.delete(userid);
}

Chatroom.prototype.getAllMemberNames = function(roomToken) {
  var list = [...this.members].map(([userid, client]) => {
    return client.memberNameForRooms.get(roomToken);
  })
  return list;
}

Chatroom.prototype.pushMessageToHistory = function(msgObj) {
  this.historyMessages.push(msgObj);
}

var ChatroomsHandler = function() { }

// store all chatroom objects
ChatroomsHandler.allRooms = new Map();
// store all chatroom names for validation check 
ChatroomsHandler.allRoomNames = new Set();

// retrieve a chatroom object by a room token
ChatroomsHandler.retrieveRoom = function(id) {
  var room = ChatroomsHandler.allRooms.get(id);
  return room ? room : null;
}

ChatroomsHandler.registerNewRoom = function(room) {
  var token = room.id;
  if (!ChatroomsHandler.allRooms.has(token)) {
    ChatroomsHandler.allRooms.set(token, room);
    ChatroomsHandler.allRoomNames.add(room.roomName);
  }
}

ChatroomsHandler.unregisterRoom = function(room) {
  ChatroomsHandler.allRooms.delete(room.id);
  ChatroomsHandler.allRoomNames.delete(room.roomName);
}

ChatroomsHandler.validateNewRoomRegistration = function(client, name, cb) {
  var res = {};
  // check if user is authenticated as one-time user 
  if (client.type === 'ot') {
    let msg = null;
    let valid = false;
    if (client.listedRoomNames.has(name)) {
      msg = 'You are using this name for too many rooms.'
    }
    // TODO: may be further validation steps
    else {
      valid = true;
    }
    res.valid = valid;
    res.message = msg;
    cb(res);
  }
  // if user is a signed up user 
  else {
    // TODO: validate chatroom at db level
  }
}

module.exports = { Chatroom, ChatroomsHandler };