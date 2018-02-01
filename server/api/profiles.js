const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
module.exports = router

router.put('/:id', (req, res, next) => {
 // create object in firebase from req.body
 if (req.body.img) {
   console.log ("recording image")
 }
 firebase.database()
    .ref('profiles/' + req.params.id)
    .set(req.body)
    .then(() => {
      res.sendStatus(200);
    })
})

router.get('/:id', (req, res, next) => {

  console.log('id', req.params.id);
  firebase.database()
    .ref('profiles/' + req.params.id)
    .once('value')
    .then(ds => {
      const user = ds.val();
      console.log('user from firebase', user);
      res.json(user);
    })
})
