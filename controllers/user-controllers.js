const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const normalize = require('normalize-url')
const asyncHandler = require('express-async-handler')

const User = require('../models/User')

// @route    POST api/users
// @desc     Register user
// @access   Public

exports.registerUsers = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body
	try {
		let user = await User.findOne({ email })

		if (user) {
			return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
		}

		const avatar = normalize(
			gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			}),
			{ forceHttps: true }
		)

		user = new User({
			name,
			email,
			avatar,
			password,
		})

		const salt = await bcrypt.genSalt(10)

		user.password = await bcrypt.hash(password, salt)

		await user.save()

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
