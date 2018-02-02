const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-github2').Strategy
const {github} = require ('../../secrets')
const firebase = require ('../db').firebase;
module.exports = router

if (!github.appId || !github.appSecret) {
    console.log('Facebook client ID / secret not found. Skipping Facebook OAuth.')

  } else {

    const githubConfig = {
      clientID: github.appId,
      clientSecret: github.appSecret,
      callbackURL: github.callback,
      profileFields: ['id', 'emails', 'name']
    }
    const strategy = new FacebookStrategy(githubConfig, (token, refreshToken, profile, done) => {
      const githubId = profile.id
      const name = profile.displayName
      console.log('github', profile)
      const email = profile.emails[0].value

      console.log('Github Auth Response profile', token);

      findUser(email, 'username')
      .then (user => {
        if (user) {
          console.log ("User found!!!", user)
          const id = Object.keys(user)[0]
          user = user[id]
          user.id = id;
          if (user.githubId) {
            if (user.githubId !== githubId) //cancel login, googleIds do not match
              return null
            return user;
          } else {
            const key = `/users/${id}/githubId`;
            const updates = {};
            updates[key] = githubId;
            firebase.database().ref().update(updates)
            .then (data => user)
          }
        }else {
        return firebase.database().ref('users/').push({username:email, name, githubId})
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

    router.get('/', passport.authenticate('github', {scope: '[users:email]'}))

    router.get('/callback', passport.authenticate('github', {
      successRedirect: '/home',
      failureRedirect: '/login'
    }))

  }
