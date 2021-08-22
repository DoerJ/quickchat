var ChatroomsHandler = require('../server/chatroom').ChatroomsHandler;

module.exports = (socket, io) => {

  var registrationHandler = () => {

  }

  var joinHandler = (params) => {

  }

  var leaveHandler = () => {

  }

  var messageHandler = (params) => {

  }

  var roomMessageHandler = (params) => {
    console.log('params: ', params);
    // push message to chatroom history stack 
    ChatroomsHandler.retrieveRoom(params.roomToken).pushMessageToHistory({
      type: params.type,
      member: params.member,
      message: params.message
    })
    // broadcast message event to all room members
    io.in(params.roomToken).emit('room-message', {
      member: params.member,
      message: params.message,
    });
  }

  var roomJoinHandler = (params) => {
    // join the socket channel of a specific room 
    socket.join(params.roomToken);
    // push join event to chatroom history stack 
    ChatroomsHandler.retrieveRoom(params.roomToken).pushMessageToHistory({
      type: params.type,
      member: params.name
    });
    // broadcast join event to all the room members
    io.in(params.roomToken).emit('room-join', {
      member: params.name
    });
  }

  return {
    registrationHandler,
    joinHandler,
    leaveHandler,
    messageHandler,
    roomMessageHandler,
    roomJoinHandler
  }
}