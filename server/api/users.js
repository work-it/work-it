const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.put('/jobs', (req, res, next) => {
  firebase.database()
    .ref('users/' + req.body.userId)
    .child('saved')
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
    .then(saved => {
      if (saved) saved.push(req.body.id)
      else saved = [req.body.id];

      return firebase.database()
        .ref('users/' + req.body.userId)
        .update({saved})
        .then(() => {
          console.log('Successfully added jobId to saved user array.!');
          res.sendStatus(200);
        })
    });
})

router.delete('/jobs/:jobid/:userid', (req, res, next) => {
  let userId = req.params.userid;
  let jobId = req.params.jobid;

  firebase.database()
    .ref('users/' + userId)
    .once('value')
    .then(ds => {
      const saved = ds.val().saved;
      console.log('VALUE', ds.val().saved)
      let newSaved = [];
      if (saved) {
        console.log('SAVED', saved);
          newSaved = saved.filter(id => {
          return id !== jobId
        })
      }

      console.log('NEW SAVED', newSaved);

      return firebase.database()
        .ref('users/' + userId)
        .update({saved: newSaved})
    })
    .then(() => res.sendStatus(200))
})
