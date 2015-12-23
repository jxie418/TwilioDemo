/*
 Load Twilio configuration from .env config file - the following environment
 variables should be set:
 process.env.TWILIO_ACCOUNT_SID
 process.env.TWILIO_API_KEY
 process.env.TWILIO_API_SECRET
 process.env.TWILIO_CONFIGURATION_SID
 */
var http = require('http');
var path = require('path');
var AccessToken = require('twilio').AccessToken;
var ConversationsGrant = AccessToken.ConversationsGrant;
var express = require('express');
var randomUsername = require('./randos');

// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/*
 Generate an Access Token for a chat application user - it generates a random
 username for the client requesting a token, and takes a device ID as a query
 parameter.
 */
app.get('/token', function(request, response) {

  var identity = (typeof (request.query.device) !='undefined' && request.query.device !='') ? request.query.device: randomUsername();
  console.log("Device is:" + request.query.device);

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
      "AC8ae1c772561cb2c33f75154e269d0938",
      "SK38697f06ee988cfd4181f836e60c8904",
      "PNquUbHDJpLMTs1HiOYEZMlMZdXU5VUC"
  );

  // Assign the generated identity to the token
  token.identity = identity;

  //grant the access token Twilio Video capabilities
  var grant = new ConversationsGrant();
  grant.configurationProfileSid = "VSc7b98796c0f90904cc650a40510623ab";
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

// Create http server and run it
/*var server = http.createServer(app);
var port = 3009;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});*/

module.exports = app;