//import { initializeApp } from 'firebase';


// const db = require('./db')

// // register models
// require('./models')

// module.exports = db

const admin = require('firebase-admin');
const { initializeApp } = require ('firebase')
const secrets = require ('../../secrets')
const serviceAccount = require('../../firebase.json');


const getFirebase = (function initFirebase () {
    let firebase = null;

    function init () {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://work-it-13fac.firebaseio.com"
            });
        
        initializeApp ({
            apiKey: secrets.firebase.webApiKey,
            authDomain: "work-it-13fac.firebaseapp.com",
            databaseURL: "https://work-it-13fac.firebaseio.com"
        })

        return {
            admin, firebase
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
