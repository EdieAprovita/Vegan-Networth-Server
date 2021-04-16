const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	avatar: {
		type: String,
		required: true,
	},

	date: {
		type: String,
		default: Date.now,
	},
})

module.exports = User = mongoose.model('User', userSchema)
