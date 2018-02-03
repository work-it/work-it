const router = require('express').Router()
const {firebase} = require ('../db')
module.exports = router

router.get('/', (req, res, next) => {
    //console.log(req.user)
    const id = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    //console.log("User id:", id)
    if (id) {
        firebase.database()
        .ref('schedule/' + id)
        .once('value')
        .then(ds => {
          const sched = [];
          const sess = ds.val()
          const sessIds = Object.keys(sess);
          sessIds.forEach (key=>sched.push(sess[key]))
          console.log('sched from firebase', sched);
          res.json(sched);
        })
        .catch(err => {
            console.log(err);
            res.json([])
        })
    } else {
        res.json({err: 'Must be logged in to see history'})
    }
})

router.post('/', (req, res, next) => {
    const userId = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    if (userId) {
        const ref = firebase.database().ref('schedule/'+userId);
        const batch = {};
        const sessions = req.body;
        sessions.forEach (session => batch[session.id] = session)

        ref.update(batch)
        .then(() => {
            res.json(sessions)
        })
        .catch(err => {
            console.log(err)
            res.json({err})
        })
    } else {
        res.json({err: 'Must be logged in to see history'})
    }
})