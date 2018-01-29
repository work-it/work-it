const router = require('express').Router()

module.exports = router

router.post('/', (req, res, next) => {
 console.log("got stuff to save", req.body)
 res.json({"YEY":"SAVED"})
})
