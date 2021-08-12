var Promise = require('promise')

// client object
var Client = function(token, type) {
  this.id = token;
  this.type = type;
  this.ownedRooms = new Map();
  this.listedRooms = new Map();
  this.listedRoomNames = new Set();
  this.memberNameForRooms = new Map();
}

Client.prototype.hasRoomOnList = function(roomToken) {
  return this.listedRooms.has(roomToken);
}

Client.prototype.addNewRoomToList = function(room) {
  this.listedRooms.set(room.id, room);
  this.listedRoomNames.add(room.roomName);
}

Client.prototype.addNewOwnerRoom = function(room) {
  this.ownedRooms.set(room.id, room);
  this.addNewRoomToList(room);
}

Client.prototype.addMemberNameForRoom = function(roomToken, name, cb) {
  this.memberNameForRooms.set(roomToken, name);
  if (cb) {
    cb();
  }
}

Client.prototype.getMemberNameForRoom = function(roomToken) {
  console.log('room token: ', roomToken);
  console.log('member names: ', this.memberNameForRooms)
  return this.memberNameForRooms.get(roomToken) || null;
}

// client handler
var ClientHandler = function() { }

ClientHandler.allOnetimeUsers = new Map();

// register one-time user with generated token
ClientHandler.authenticateOnetimeUser = function(client, cb) {
  var token = client.id;
  ClientHandler.allOnetimeUsers.set(token, client);
  cb();
}

ClientHandler.unregisterOnetimeUser = function(token, cb) {
  ClientHandler.allOnetimeUsers.delete(token);
  cb();
}

ClientHandler.getClient = function(id) {
  return ClientHandler.allOnetimeUsers.get(id);
}

module.exports = { Client, ClientHandler };