const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
//const {User} = require('../db/models')
const secrets = require ('../../secrets')
const firebase = require ('../db').firebase;
module.exports = router

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */

console.log('secrets', secrets.google)

if (!secrets.google.clientId || !secrets.google.secret) {

  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {

  const googleConfig = {
    clientID: secrets.google.clientId,
    clientSecret: secrets.google.secret,
    callbackURL: secrets.google.callback
  }

  const strategy = new GoogleStrategy(googleConfig, (token, refreshToken, profile, done) => {
    const googleId = profile.id
    const name = profile.displayName
    const email = profile.emails[0].value

    console.log('Google Auth Response profile', token);

    const user = {username: email, name, googleId};

    firebase.database().ref('users/').push(user)
    .then (dbObj => {
      user.id = dbObj.path.pieces_[1];
      done(null, user)
    })
    .catch(function(error) {
      console.log("error", error)
      done({err: error}, null)
    });


    //We need to register an Observer on Firebase Auth to make sure auth is initialized.
    // const unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    //   unsubscribe();
    //   // Check if we are already signed-in Firebase with the correct user.
    //   if (!isUserEqual(profile, firebaseUser)) {
    //     // Build Firebase credential with the Google ID token.
    //     const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    //     // Sign in with credential from the Google user.
    //     firebase.auth().signInWithCredential(credential)
    //     .then(user => {
    //       console.log("User signed in with google", user);
    //       done( null, user);

    //     })
    //     .catch(function(error) {
    //       // Handle Errors here.
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       // The email of the user's account used.
    //       const email = error.email;
    //       // The firebase.auth.AuthCredential type that was used.
    //       const credential = error.credential;
    //       // ...
    //       console.log("error during sign up", error)
    //       done (error)
    //     });
    //   } else {
    //     console.log('User already signed-in Firebase.');
    //     done(null)
    //   }
    // });

    // User.find({where: {googleId}})
    //   .then(foundUser => (foundUser
    //     ? done(null, foundUser)
    //     : User.create({name, email, googleId})
    //       .then(createdUser => done(null, createdUser))
    //   ))
    //   .catch(done)
  })

  passport.use(strategy)

  router.get('/', (req, res, next) => {
    console.log("hit the route")
    passport.authenticate('google', {scope: 'email'})(req, res, next);
    console.log("passport.authenticate called",)
  })

  router.get('/callback', (req, res, next) => {
    console.log("hit the callback")
    passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/login'
    })(req,res,next)
  })

}
