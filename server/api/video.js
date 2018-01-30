const twilio = require('twilio'); 
const twilioClient = {
    accountSid: 'AC72ecdf07b809798a2b893a1b5b47d017',
    authToken: 'ba640c836a721fd876a5d7c8a2b80afd',
    keySid:'SK8f787afeb5bd3c142ab8f2e54cd960a3',
    keySecret:'YparFV01d6RKKKFXIwPnTR6IeyDAfgWL',
    twilioPhone:'+15162070820'
}
//const client = new twilio(twilioClient.accountSid, twilioClient.authToken);

const client = new twilio(twilioClient.keySid, twilioClient.keySecret, { accountSid: twilioClient.accountSid });
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const router = require('express').Router()

module.exports = router
let counter = 0;

router.get('/token', (req, res, next) => {
    console.log('req.query', req.query);
    if (req.query.roomName) {
        const accessToken = new AccessToken(
            twilioClient.accountSid,
            twilioClient.keySid,
            twilioClient.keySecret
          );
          
          // Set the Identity of this token
          accessToken.identity = ""+(counter++);

          // Grant the access token Twilio Video capabilities.
          const grant = new VideoGrant();
          accessToken.addGrant(grant);

          console.log("access token", accessToken.toJwt())
          res.json({
              identity: accessToken.identity,
              token: accessToken.toJwt()
          })
          
    } else {
        res.json({err: "no room specified"})
    }
    

})
