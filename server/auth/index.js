const router = require('express').Router()
//const User = require('../db/models/user')
const {admin, firebase} = require ('../db')
const findUser = require ('./util')
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = router

router.post('/login', (req, res, next) => {
  console.log("hit logoin")
  findUser(req.body.email, 'username')
    .then (user => {
      if (user ) {
        const id = Object.keys(user)[0];

        bcrypt.compare(req.body.password, user[id].password)
        .then(() => {
          console.log("password and hash are equal")
          const userObj = {
            email: user[id].username,
            id,
            saved: user[id].saved,
            applications: user[id].applications,
            name: user[id].name
          }
          req.login(userObj, err=> (err?next(err) : res.json(userObj)))
        })
        .catch(() => {
          res.json({err: "Username or password does not match"})
        })
      } else {
        res.json({err: "User not found"})
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      console.log("error", error)
      res.status(401).json({err: error})
    });
})


router.post('/signup', (req, res, next) => {
  //console.log("req.body", req.body)
  findUser(req.body.email, 'username')
  .then (user => {
    if (user) {
      res.json({err: 'Username/email already exists'})
    } else {
      user = {email: req.body.email};
      bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        console.log("signup Hash", hash, req.body.password)
        return firebase.database().ref('users/').push({
          username: req.body.email,
          password: hash
        })
      })
      .then (dbObj => {
        user.id = dbObj.path.pieces_[1];
        req.login(user, err=> (err?next(err) : res.json(user)))
      }).catch(function(error) {
        console.log("error", error)
        res.json({err: error})
      });
    }
  }).catch(function(error) {
    console.log("error", error)
    res.json({err: error})
  });
})

router.post('/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

router.get('/me', (req, res) => {
  if (req.user) console.log("user found!!!!!!!!!!!!!!!!!!!", req.user)
  let user = req.user;
  console.log('USER', user);
  if (user && !user.id) {
    const id = Object.keys(user)[0];
    user = {
      email: user[id].username,
      id,
      saved: user[id].saved,
      applications: user[id].applications,
      name: user[id].name
    }
  }

  res.json(user)
})

router.use('/google', require('./google'))
router.use('/facebook', require ('./facebook'))
router.use('/github', require ('./github'))
