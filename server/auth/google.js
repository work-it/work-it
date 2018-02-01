const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
//const {User} = require('../db/models')
const secrets = require ('../../secrets')
const firebase = require ('../db').firebase;
const findUser = require ('./util')
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

    findUser(email, 'username')
    .then (user => {
      if (user) {
        console.log ("User found!!!", user)
        const id = Object.keys(user)[0]
        user.id = id;
        if (user.googleId) {
          if (user.googleId !== googleId) //cancel login, googleIds do not match
            return null
          return user;
        } else {
          const key = `/users/${id}/googleId`;
          const updates = {};
          updates[key] = googleId;
          firebase.database().ref().update(updates)
          .then (data => user)
        }
      }else {
      return firebase.database().ref('users/').push({username:email, name, googleId})
      .then(user => {
        user.id = user.path.pieces_[1];
        return user;
      })
    
    }})
    .then (user =>  done(null, user))
    .catch(function(error) {
      console.log("error", error)
      done({err: error}, null)
    })

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
