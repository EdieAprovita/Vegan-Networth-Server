const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('express-async-handler')
const normalizeUrl = require('normalize-url')
const gravatar = require('gravatar')

exports.registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body

	const userExist = await User.findOne({ email })

	if (userExist) {
		res.status(400).json({ message: 'User already exists!!' })
	}

	const avatar = normalizeUrl(
		gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm',
		}),
		{ forceHttps: true }
	)

	const user = await User.create({
		name,
		email,
		password,
		avatar,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error({ message: `${Error}`.red })
	}
})

exports.authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error({ message: `${Error}`.red })
	}
})
