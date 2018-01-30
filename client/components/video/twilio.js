const twilio = require('twilio'); 
const twilioClient = {
    accountSid: 'AC72ecdf07b809798a2b893a1b5b47d017',
    authToken: 'ba640c836a721fd876a5d7c8a2b80afd',
    keySid:'SK8f787afeb5bd3c142ab8f2e54cd960a3',
    keySecret:'YparFV01d6RKKKFXIwPnTR6IeyDAfgWL',
    twilioPhone:'+15162070820'
}
//const client = new twilio(twilioClient.accountSid, twilioClient.authToken);


const client = new Twilio(twilioClient.keySid, twilioClient.keySecret, { accountSid: twilioClient.accountSid });

client.video.rooms
  .create({
    uniqueName: 'DailyStandup',
  })
  .then(room => {
    console.log(room.sid);
  });

// const AccessToken = twilio.jwt.AccessToken;
// const VideoGrant = AccessToken.VideoGrant;

// Create an Access Token
const accessToken = new AccessToken(
  twilioClient.accountSid,
  twilioClient.keySid,
  twilioClient.keySecret
);

// Set the Identity of this token
accessToken.identity = 'workit';


const startRoom = roomName => {
    
    client.video.rooms
  .create({
    uniqueName: roomName,
  })
  .then(room => {
    console.log(room.sid);
    // // Grant access to Video
    const grant = new VideoGrant();
    accessToken.addGrant(room.name);
    const jwt = accessToken.toJwt();
    console.log(jwt);
    
    return twilio.Video.connect(accessToken, {name: room.name})
  }).then(function(room) {
    console.log('Successfully joined a Room: ', room);
    room.on('participantConnected', function(participant) {
      console.log('A remote Participant connected: ', participant);
    })
  }, function(error) {
      console.error('Unable to connect to Room: ' +  error.message);
  })
  .catch (console.log);

}




module.exports = {startRoom, twilio};