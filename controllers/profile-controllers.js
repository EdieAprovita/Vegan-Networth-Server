const normalize = require('normalize-url')
const axios = require('axios')
const asyncHandler = require('express-async-handler')

const Profile = require('../models/Profile')
const User = require('../models/User')
const Post = require('../models/Post')

exports.getProfile = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user._id,
		}).populate('User', ['name', 'avatar'])

		if (!profile) {
			return res.status(400).json({ message: 'There is no profile for this user' })
		}

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.createUpdateProfile = asyncHandler(async (req, res) => {
	const {
		website,
		skills,
		youtube,
		twitter,
		instagram,
		linkedin,
		facebook,
		...rest
	} = req.body

	const profileFields = {
		user: req.user._id,
		website:
			website && website !== '' ? normalize(website, { forceHttps: true }) : '',
		skills: Array.isArray(skills)
			? skills
			: skills.split(',').map(skill => ' ' + skill.trim()),
		...rest,
	}

	const socialFields = { youtube, twitter, instagram, linkedin, facebook }

	for (const [key, value] of Object.entries(socialFields)) {
		if (value && value.length > 0)
			socialFields[key] = normalize(value, { forceHttps: true })
	}
	profileFields.social = socialFields

	try {
		let profile = await Profile.findOneAndUpdate(
			{ user: req.user._id },
			{ $set: profileFields },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)
		return res.json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getAllProfiles = asyncHandler(async (req, res) => {
	try {
		const profiles = await Profile.find().populate('User', ['name', 'avatar'])
		res.status(200).json(profiles)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getProfileById = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findById(req.params._id).populated('User', [
			'name',
			'avatar',
		])

		if (!profile) return res.status(400).json({ message: 'Profile not found' })

		return res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteProfileInfo = asyncHandler(async (req, res) => {
	try {
		await Promise.all([
			Post.deleteMany({ user: req.user._id }),
			Profile.findOneAndRemove({ user: req.user._id }),
			User.findOneAndRemove({ _id: req.user._id }),
		])
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.addExperience = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user._id })

		profile.experience.unshift(req.body)

		await profile.save()

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteExperience = asyncHandler(async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user._id })

		foundProfile.experience = foundProfile.experience.filter(
			exp => exp._id.toString() !== req.params.exp_id
		)

		await foundProfile.save()
		return res.status(200).json(foundProfile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.AddEducation = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user._id })

		profile.education.unshift(req.body)

		await profile.save()

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteEducation = asyncHandler(async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user._id })
		foundProfile.education = foundProfile.education.filter(
			edu => edu._id.toString() !== req.params.edu_id
		)
		await foundProfile.save()
		return res.status(200).json(foundProfile)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getGithubProfile = asyncHandler(async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
		)
		const headers = {
			'user-agent': 'node.js',
			Authorization: `token ${config.get('githubToken')}`,
		}

		const gitHubResponse = await axios.get(uri, { headers })
		return res.json(gitHubResponse.data)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
