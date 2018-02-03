const router = require('express').Router()
const {firebase} = require ('../db')
module.exports = router

router.get('/', (req, res, next) => {
    //console.log(req.user)
    const id = req.user? (req.user.id?req.user.id:Object.keys(req.user)[0]):null;
    //console.log("User id:", id)
    if (id) {
        firebase.database()
        .ref('practice/' + id)
        .once('value')
        .then(ds => {
          const hist = ds.val();
          //console.log('hist from firebase', hist);
          res.json(hist);
        })
        .catch(console.log)
    } else {
        res.json({err: 'Must be logged in to see history'})
    }
})