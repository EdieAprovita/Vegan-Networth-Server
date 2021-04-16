const express = require('express')
const router = express.Router()

const { registerUsers } = require('../controllers/user-controllers')

router.post('/', registerUsers)

module.exports = router
