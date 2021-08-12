const bodyParser = require('body-parser');
var express = require('express');
var app = express();
// create http server 
var server = require('http').Server(app);
// create socket server  
var io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

var initializeHandlers = require('./server/handler');

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/'));
// support JSON-encoded request body 
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// turn on socket server 
io.on('connection', client => {
  console.log('client has joined the connection: ', client.id);

  // initialize chat handlers
  var {
    registrationHandler, 
    joinHandler, 
    leaveHandler, 
    messageHandler, 
    roomMessageHandler
  } = initializeHandlers(client, io);
  // register events for connected user 
  client.on('register', registrationHandler);
  client.on('join', joinHandler);
  client.on('leave', leaveHandler);
  // message event on left menu
  client.on('message', messageHandler);
  // message event in chatroom
  client.on('room-message', roomMessageHandler)

  client.on('disconnect', () => { });

  client.on('error', err => {
    console.log('socket error occurs from client: ', client.id);
  });
});

app.use('/auth/', require('./routes/auth'));
app.use('/room/', require('./routes/room'));
app.use('/client/', require('./routes/client'));

// turn on http server on port 8443
server.listen(8443, () => {
  console.log('listening on port 8443...')
});
