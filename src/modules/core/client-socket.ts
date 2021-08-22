var io = require('socket.io-client');

export class ClientSocket {

  public static socket: any;

  constructor() { }

  // since callbacks are not supported for broadcast, need to define callbacks for each socket listener
  public static callbacksToReceiveSocketData: any = {
  }

  public static initClientSocketConnection(): void {
    ClientSocket.socket = io('http://localhost:8443');
    ClientSocket.socket.on('error', (error: any) => {
      console.log('received socket error: ', error);
    })

    // // join event 
    // ClientSocket.socket.on('join', (data: any) => {
    //   data.callback({
    //     event: 'join', 
    //     data: data.member
    //   });
    // });

    // // leave event 
    // ClientSocket.socket.on('leave', (data: any) => {
    //   data.callback({
    //     event: 'leave', 
    //     data: data.member 
    //   });
    // })

    // // message event 
    // ClientSocket.socket.on('message', (data: any, cb: Function) => {
    //   // TODO
    // });
  }

  // listen to message event in chatroom 
  public static receiveRoomMessageEvent = (cb: Function) => {
    console.log('listening to room message event...')
    ClientSocket.socket.on('room-message', (data: any) => {
      console.log('receiving room message...')
      cb({
        event: 'message',
        data: {
          member: data.member,
          text: data.message
        }
      });
    });
  }

  // listen to join event in chatroom 
  public static receiveRoomJoinEvent = (cb: Function) => {
    ClientSocket.socket.on('room-join', (data: any) => {
      console.log('receiving data: ', data)
      cb({
        event: 'join',
        data: data
      });
    });
  }

  // listen to leave event in chatroom 
  public static receiveRoomLeaveEvent = (cb: Function) => {
    ClientSocket.socket.on('room-leave', (data: any) => {
      console.log('receiving data: ', data)
      cb({
        event: 'leave',
        data: data
      });
    });
  }

  public static registrationHandler(data: any, cb: Function): void {
    ClientSocket.socket.emit('register', data, cb);
  }

  public static joinHandler(data: any): void {
    ClientSocket.socket.emit('join', data);
  }

  public static leaveHandler(data: any, cb: Function): void {
    ClientSocket.socket.emit('leave', data, cb);
  }

  public static messageHandler(data: any, callback: Function): void {
    ClientSocket.socket.emit('message', data, callback);
  }

  public static roomMessageHandler(data: any): void {
    ClientSocket.socket.emit('room-message', data);
  }

  public static roomJoinHandler(data: any): void {
    ClientSocket.socket.emit('room-join', data);
  }

}   