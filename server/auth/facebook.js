const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-facebook').Strategy
const {facebook} = require ('../../secrets')
const firebase = require ('../db').firebase;
module.exports = router

if (!facebook.appId || !facebook.appSecret) {
    console.log('Facebook client ID / secret not found. Skipping Facebook OAuth.')

  } else {

    const facebookConfig = {
      clientID: facebook.appId,
      clientSecret: facebook.appSecret,
      callbackURL: facebook.callback,
      profileFields: ['id', 'emails', 'name']
    }
    const strategy = new FacebookStrategy(facebookConfig, (token, refreshToken, profile, done) => {
      const facebookId = profile.id
      const name = profile.displayName
      const email = profile.emails[0].value

      console.log('Facebook Auth Response profile', token);

      findUser(email, 'username')
      .then (user => {
        if (user) {
          console.log ("User found!!!", user)
          const id = Object.keys(user)[0]
          user = user[id]
          user.id = id;
          if (user.facebookId) {
            if (user.facebookId !== facebookId) //cancel login, googleIds do not match
              return null
            return user;
          } else {
            const key = `/users/${id}/facebookId`;
            const updates = {};
            updates[key] = facebookId;
            firebase.database().ref().update(updates)
            .then (data => user)
          }
        }else {
        return firebase.database().ref('users/').push({username:email, name, facebookId})
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

    router.get('/', passport.authenticate('facebook', {scope: 'email'}))

    router.get('/callback', passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    }))

  }
