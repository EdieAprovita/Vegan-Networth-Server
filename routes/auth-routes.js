const express = require('express')
const router = express.Router()

const { registerUser, authUser } = require('../controllers/auth-controllers')

// AUTH ROUTES

router.post('/signup', registerUser)
router.post('/login', authUser)

module.exports = router
