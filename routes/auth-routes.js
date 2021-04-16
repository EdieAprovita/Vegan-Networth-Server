const express = require('express')
const router = express.Router()

const { getUserToken, authUser } = require('../controllers/auth-controllers')
const auth = require('../middlewares/authMiddleware')

// AUTH ROUTES

router.get('/', auth, getUserToken)
router.post('/', authUser)

module.exports = router
