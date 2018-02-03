const router = require('express').Router()
const {firebase} = require ('../db')
module.exports = router

router.post('/', (req, res, next) => {
 console.log("got stuff to save", req.user)
 const id = req.user.id?req.user.id:Object.keys(req.user)[0]

 const timestamp = Date.now();
 const practiceObj = req.body;
 
 firebase.database()
    .ref('practice/' + id)
    .update({[timestamp]:req.body})
    .then(() => {
      res.sendStatus(200);
    })
})
