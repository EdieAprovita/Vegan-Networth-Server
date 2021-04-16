const express = require('express')
const router = express.Router()

const {
	getProfile,
	createUpdateProfile,
	getAllProfiles,
	getProfileById,
	deleteProfileInfo,
	addExperience,
	AddEducation,
	deleteExperience,
	deleteEducation,
	getGithubProfile,
} = require('../controllers/profile-controllers')

const auth = require('../middlewares/authMiddleware')

router.get('/me', auth, getProfile)
router.get('/', getAllProfiles)
router.get('/user/:user_id', auth, getProfileById)
router.get('/github/:username', auth, getGithubProfile)
router.post('/', auth, createUpdateProfile)
router.put('/experience', auth, addExperience)
router.put('/education', auth, AddEducation)
router.delete('/', auth, deleteProfileInfo)
router.delete('/experience/:exp_id', auth, deleteExperience)
router.delete('/education/:edu_id', auth, deleteEducation)

module.exports = router
