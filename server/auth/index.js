const router = require('express').Router()
//const User = require('../db/models/user')
const {admin, firebase} = require ('../db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = router


router.post('/login', (req, res, next) => {
  console.log("hit logoin")
  bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    console.log('Hashed')
    return firebase.database()
    .ref('/users')
    .orderByChild('username')
    .equalTo(req.body.email)
    .once('value')
    .then (ds => {
      const user = ds.val();

      if (user ) {
        const id = Object.keys(user)[0];
        console.log("id", id, user[id].password, hash);
        if (user[id].password === hash) {
          console.log("password and has are equal")
          const userObj = {
            email: user[id].username,
            id
          }
          req.login(userObj, err=> (err?next(err) : res.json(userObj)))
        } else {
          res.json({err: "Username or password does not match"})
        }
      } else {
        res.json({err: "User not found"})
      }
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
  if (req.user) console.log("user found!!!!!!!!!!!!!!!!!!!", req.user)
  let user = req.user;
  if (user && !user.id) {
    const id = Object.keys(user)[0];
    user = {
      email: user[id].username,
      id
    }
  }

  res.json(user)
})

router.use('/google', require('./google'))
