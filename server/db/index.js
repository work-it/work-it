
// const db = require('./db')

// // register models
// require('./models')

// module.exports = db

const admin = require('firebase-admin');
const firebase = require ('firebase')
const secrets = require ('../../secrets')
const serviceAccount = require('../../firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://work-it-13fac.firebaseio.com"
  });

firebase.initializeApp ({
    apiKey: secrets.firebase.webApiKey,
    authDomain: "work-it-13fac.firebaseapp.com",
    databaseURL: "https://work-it-13fac.firebaseio.com"
})
module.exports = {admin, firebase};
