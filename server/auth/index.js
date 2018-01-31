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
    .orderByValue()
    .equalTo(req.body.email)
    .once('value', val=> console.log(val))
  })
      
      
      
  //     {
  //     username: req.body.email,
  //     password: hash
  //   })
  // })
  // .then (dbObj => {
  //   req.login(dbObj, err=> (err?next(err) : res.json(dbObj)))
  // })
  // .catch(function(error) {
  //   console.log("error", error)
  //   res.json({err: error})
  // });
  // firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  //   .then(user => {
  //     //console.log("got some object back", user);
  //     req.login(user, err=> {
  //       if (err) next(err)
  //       else {
  //         //console.log("req has a user!", req.user)
  //         res.json(user)
  //       } 
  //   })})
  //   .catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log("error", error.code+" "+errorMessage)
  //   res.status(401).json({err: error.code+" "+errorMessage})
  // });
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
  firebase.auth().signOut().then(function() {
    req.logout()
    req.session.destroy()
    res.redirect('/')
  }).catch(function(error) {
    console.log("error",  error.code+" "+errorMessage)
  });
  
})

router.get('/me', (req, res) => {
  if (req.user) console.log("user found!!!!!!!!!!!!!!!!!!!")
  res.json(req.user)
})

router.use('/google', require('./google'))
