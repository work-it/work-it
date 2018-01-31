const router = require('express').Router()
//const User = require('../db/models/user')
const {admin, firebase} = require ('../db')
console.log('in index auth', require ('../db'))
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = router


router.post('/login', (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    return firebase.database()
    .ref('/users')
    .orderByChild('username')
    .equalTo(req.body.email)
    .once('value')
    .then (ds => {
      const user = ds.val();
      if (user && user.password === hash) {
        delete user.password;
        user.id = Object.keys(user)[0];
        req.login(user, err=> (err?next(err) : res.json(user)))
      }
      console.log(ds.val())
    })
  }) .catch(function(error) {
    // Handle Errors here.
    console.log("error", error)
    res.status(401).json({err: error})
  });
})


router.post('/signup', (req, res, next) => {
  //console.log("req.body", req.body)
  const user = {email: req.body.email};
  bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    return firebase.database().ref('users/').push({
      username: req.body.email,
      password: hash
    })
  })
  .then (dbObj => {
    user.id = dbObj.path.pieces_[1];
    req.login(user, err=> (err?next(err) : res.json(user)))
  })
  .catch(function(error) {
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
  if (req.user) console.log("user found!!!!!!!!!!!!!!!!!!!")
  res.json(req.user)
})

router.use('/google', require('./google'))
