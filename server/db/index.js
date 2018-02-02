const admin = require('firebase-admin');
const firebaseRegular = require ('firebase')

const secrets = require ('../../secrets')
const serviceAccount = require('../../firebase.json');


const getFirebase = (function initFirebase () {
    let firebase = null;

    function init () {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: 'work-it-13fac.appspot.com'
            });
      
        firebaseRegular.initializeApp ({
            apiKey: secrets.firebase.webApiKey,
            authDomain: "work-it-13fac.firebaseapp.com",
            databaseURL: "https://work-it-13fac.firebaseio.com"
        })

        return {
            firebase: firebaseRegular, admin
        }
    }
    return function getInstance () {
        if (!firebase) {
            firebase = init();
        }
        return firebase;
    }
})();



module.exports = getFirebase();
