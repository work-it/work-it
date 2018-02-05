const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
const defaultQuestions = require('./questions-seed');
const zipcodes = require('zipcodes');
module.exports = router

router.get('/seed', (req, res, next) => {

  // create object in firebase from req.body
  defaultQuestions.forEach(question => {
  firebase.database()
    .ref('questions/')
    .push(question)
    .then((snapshot) => {
      return snapshot.getKey();
    })
    .then(key => {
      firebase.database()
        .ref('questions/' + key)
        .update({id: key})
        .then(() =>{
          console.log('seeded!');
        })
    })
    .then(res.end());
  })
})


router.get('/', (req, res, next) => {
 firebase.database()
  .ref('/questions')
  .once('value')
  .then(ds => ds.val())
  .then( questions => {
    const questionsArr = []
    const keys = Object.keys(questions)
    keys.forEach(key => questionsArr.push(questions[key]))
    return questionsArr
  })
  .then(questionsArr => res.json(questionsArr))
})


router.get('/:id', (req, res, next) => {

  console.log('id', req.params.id);
  firebase.database()
    .ref('questions/' + req.params.id)
    .once('value')
    .then(ds => {
      const question = ds.val();
      console.log('question from firebase', question);
      res.json(question);
    })
})
