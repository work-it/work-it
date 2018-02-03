const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'));
router.use('/state', require('./state'));
router.use('/rooms', require('./rooms'));
router.use('/profiles', require('./profiles'))
router.use('/jobs', require('./jobs'));
router.use('/history', require ('./history'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
