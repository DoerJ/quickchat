var ChatroomsHandler = require('../server/chatroom').ChatroomsHandler;

module.exports = (socket, io) => {

  var registrationHandler = () => {

  }

  var joinHandler = (params) => {
    console.log('joining socket: ', params)
    // join the socket channel of a specific room 
    socket.join(params.roomToken);
    // broadcast join event to all the room members
    socket.to(params.roomToken).emit('join', {
      memeber: params.name,
      callback: params.callback
    });
  }

  var leaveHandler = () => {

  }
  var messageHandler = (params) => {

  }

  var roomMessageHandler = (params) => {
    console.log('params: ', params);
    // push message to chatroom history stack 
    ChatroomsHandler.retrieveRoom(params.roomToken).pushMessageToHistory({
      member: params.member,
      message: params.message
    })
    // broadcast message event to all room members
    io.in(params.roomToken).emit('room-message', {
      member: params.member,
      message: params.message,
    });
  }

  return {
    registrationHandler,
    joinHandler,
    leaveHandler,
    messageHandler,
    roomMessageHandler
  }
}