
// const db = require('./db')

// // register models
// require('./models')

// module.exports = db

const admin = require('firebase-admin');

const serviceAccount = require('../../firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://work-it-13fac.firebaseio.com"
  });

module.exports = admin;
