const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const asyncHandler = require('express-async-handler')

// @route    GET api/auth
// @desc     Get user by token
// @access   Private

exports.getUserToken = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')
		res.json(user)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red.bold })
	}
})

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

exports.authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	try {
		let user = await User.findOne({ email })

		if (!user) {
			return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
		}

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
		}

		const payload = {
			user: {
				id: user.id,
			},
		}

		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{ expiresIn: '5 days' },
			(err, token) => {
				if (err) throw err
				res.json({ token })
			}
		)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red.bold })
	}
})
