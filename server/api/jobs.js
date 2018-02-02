const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
const defaultJobs = require('./jobs-seed');
const zipcodes = require('zipcodes');
module.exports = router

router.get('/seed', (req, res, next) => {

  // create object in firebase from req.body
  defaultJobs.forEach(job => {
  firebase.database()
    .ref('jobs/')
    .push(job)
    .then((snapshot) => {
      return snapshot.getKey();
    })
    .then(key => {
      firebase.database()
        .ref('jobs/' + key)
        .update({id: key})
        .then(() =>{
          console.log('seeded!');
        })
    });
  })
})

router.put('/save', (req, res, next) => {
  // create object in firebase from req.body
  firebase.database()
    .ref('jobs/' + req.body.id)
    .child('savedBy')
    .once('value')
    .then(snapshot => {
      return snapshot.val()
    })
    .then(currentlySaved => {
      if (currentlySaved) {
        currentlySaved.push(req.body.userId);
      } else {
        currentlySaved = [req.body.userId];
      }

      return firebase.database()
        .ref('jobs/' + req.body.id)
        .child('savedBy')
        .set(currentlySaved)
    })
    .then(() => res.sendStatus(200))
})

router.get('/:id', (req, res, next) => {
  firebase.database().ref('/jobs')
  .orderByKey()
    .equalTo(req.params.id)
    .once('value')
    .then (ds => ds.val())
    .then (job => {
      console.log("got job back", job)
      res.json (job);
    })
    .catch (console.log)
})

router.get('/search/:location/:term', (req, res, next) => {
  console.log(req.params);
  let term = req.params.term;
  let location;
  if (req.params.location.indexOf(',') !== -1) {
    const city = req.params.location.split(', ')[0];
    const state = req.params.location.split(', ')[1];
    location = zipcodes.lookupByName(city, state)[0].zip;
  } else {
    location = req.params.location;
  }

  console.log('location after lookup', location);

  const surroundingZips = zipcodes.radius(location, 25);

  firebase.database()
    .ref('/jobs')
    .once('value')
    .then(ds => {
      const jobs = ds.val();

      let matchedJobs = [];
      for (let key in jobs) {
        if (jobs.hasOwnProperty(key)) {
          const job = jobs[key];
          // Match jobs that include the term in the position name, skills or
          // role description.
          if (
            (job.position.includes(term) ||
            job.topSkills.includes(term) ||
            job.roleDesc.includes(term)) &&
            surroundingZips.includes(job.zip)
          ) {
            matchedJobs.push(job);
          }
        }
      }

      res.send(matchedJobs);
    })

})

router.get('/saved/:userid', (req, res, next) => {

  let userId = req.params.userid;

  firebase.database()
    .ref('/jobs')
    .once('value')
    .then(ds => {
      const jobs = ds.val();

      let matchedJobs = [];
      for (let key in jobs) {
        if (jobs.hasOwnProperty(key)) {
          const job = jobs[key];
          // Match jobs that include the term in the position name, skills or
          // role description.
          if (job.savedBy && job.savedBy.includes(userId)) {
            matchedJobs.push(job);
          }
        }
      }

      res.send(matchedJobs);
    })

})

router.delete('/saved/:jobid/:userid', (req, res, next) => {

  let userId = req.params.userid;
  let jobId = req.params.jobid;

  firebase.database()
    .ref('jobs/' + jobId)
    .once('value')
    .then(ds => {
      const job = ds.val();
      let newSavedBy = [];
      job.savedBy.forEach(savedUserId => {
        if (savedUserId !== userId) {
          newSavedBy.push(savedUserId);
        }
      })

      return firebase.database()
        .ref('jobs/' + jobId)
        .child('savedBy')
        .set(newSavedBy)
    })
    .then(() => res.sendStatus(200))

})

