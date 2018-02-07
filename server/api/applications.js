const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
const defaultJobs = require('./jobs-seed');
const zipcodes = require('zipcodes');
module.exports = router

router.post('/', (req, res, next) => {
  // create object in firebase from req.body
  firebase.database()
    .ref('applications/')
    .push(req.body.application)
    .then((snapshot) => {
      return snapshot.getKey()
    })
    .then(key => {
      return firebase.database()
      .ref('applications/' + key)
      .update({id: key, userId: req.body.userId, employerId: req.body.employerId})
      .then(() => {
        return key;
      })
    })
    .then(key => {
      return firebase.database()
      .ref('users/' + req.body.userId)
      .once('value')
      .then(snapshot => {
        let updatedApplications;
        let currentApplications = snapshot.val().applications;
        if (currentApplications) {
          updatedApplications = [...currentApplications, key]
        } else {
          updatedApplications = [key];
        }
        return updatedApplications
    })
    .then(updatedApplications => {
      return firebase.database()
      .ref('users/' + req.body.userId)
      .update({applications: updatedApplications})
    })
    .then(() => {
      console.log('Added application to db and user object!');
      res.sendStatus(200);
    })
  })
})

router.get('/:userid', (req, res, next) => {
  let userId = req.params.userid;
  let applicationsToReturn = [];

  firebase.database()
    .ref('users/' + userId)
    .once('value')
    .then(snapshot => {
      return snapshot.val().applications;
    })
    .then(applicationsArr => {
      console.log('APPS ARRAY', applicationsArr)
      // Loop through ids and fetch app by each key and return to client
      if (applicationsArr && applicationsArr.length) {
        applicationsArr.forEach(appKey => {
          firebase.database()
            .ref('applications/' + appKey)
            .once('value')
            .then(snapshot => {
              applicationsToReturn.push(snapshot.val())
              // Once we have pushed all the apps into the return array, send to client
              if (applicationsToReturn.length === applicationsArr.length) {
                res.send(applicationsToReturn);
              }
            })
        })
      } else {
        res.send(applicationsToReturn)
      }
    })
})

router.put('/:applicationId/notes', (req, res, next) => {
  let applicationId = req.params.applicationId;
  console.log('application id', applicationId)

  firebase.database()
    .ref('applications/' + applicationId)
    .update({applicantNotes: req.body.notes})
    .then(() => {
      res.sendStatus(200);
    })
})

router.put('/:applicationId/employer/notes', (req, res, next) => {
  let applicationId = req.params.applicationId;
  console.log('application id', applicationId)

  firebase.database()
    .ref('applications/' + applicationId)
    .update({employerNotes: req.body.notes})
    .then(() => {
      res.sendStatus(200);
    })
})


router.put('/:applicationId/message', (req, res, next) => {
  let applicationId = req.params.applicationId;

  firebase.database()
    .ref('applications/' + applicationId)
    .update({chat: req.body.message})
    .then(() => {
      res.sendStatus(200);
    })
})

router.put('/:applicationId/archive', (req, res, next) => {
  let applicationId = req.params.applicationId;

  firebase.database()
    .ref('applications/' + applicationId)
    .update({archived: true})
    .then(() => {
      res.sendStatus(200);
    })
})

router.put('/:applicationId/review', (req, res, next) => {
  let applicationId = req.params.applicationId;

  firebase.database()
    .ref('applications/' + applicationId)
    .update({status: 'review'})
    .then(() => {
      res.sendStatus(200);
    })
})

router.put('/:applicationId/interview', (req, res, next) => {
  let applicationId = req.params.applicationId;

  firebase.database()
    .ref('applications/' + applicationId)
    .update({status: 'interview'})
    .then(() => {
      res.sendStatus(200);
    })
})

router.get('/employer/:employerId', (req, res, next) => {
  let employerId = req.params.employerId;

  firebase.database()
    .ref('applications/')
    .orderByChild('employerId')
    .equalTo(employerId)
    .once('value')
    .then(snapshot => {
      console.log('SNAPSHOT', snapshot.val())
      return snapshot.val();
    })
    .then(applications => {
      let applicationsToReturn = [];

      if (applications ) {
        for (let key in applications) {
          if (applications.hasOwnProperty(key)) {
            // Destructure object full of jobs into a useable array
            let application = applications[key];
            const userId = application.userId;

            firebase.database()
              .ref('profiles/' + userId)
              .once('value')
              .then(snapshot => {
                const profile = snapshot.val();
                application.profile = profile;
                applicationsToReturn.push(application);
                console.log('LENGTHS', applicationsToReturn.length, application.length)
                // If all the applications & profiles have been pushed, send to client.
                if (applicationsToReturn.length === Object.keys(applications).length) {
                  console.log('DONE')
                  return res.send(applicationsToReturn);
                }
              })
          }
        }
      }
    })
})

