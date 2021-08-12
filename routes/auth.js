var router = require('express').Router();
var clients = require('../server/client-handler');
var ClientHandler = clients.ClientHandler;
var Client = clients.Client;

var generateRandomToken = function(token_len) {
  var chars = 'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = [];
  var random = require('crypto').randomBytes(token_len);
  for (let i = 0; i < token_len; i++) {
    token.push(chars[random[i] % chars.length]);
  }
  return token.join('');
}

router.all('/login', function(req, res) {
  // TODO: enable db authentication
});

router.all('/guest', function(req, res) {
  console.log('authenticating guest user...');
  var token = generateRandomToken(8);

  var callback = function() {
    var url = 'http://localhost:3000/ot-token=' + token + '/';
    res.redirect(302, url);
  }
  ClientHandler.authenticateOnetimeUser(new Client(token, 'ot'), callback);
});

module.exports = router;