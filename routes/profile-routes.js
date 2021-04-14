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

const { protect } = require('../middlewares/authMiddleware')

router.get('/me', protect, getProfile)
router.get('/allProfiles', getAllProfiles)
router.get('/user/:user_id', protect, getProfileById)
router.get('/github/:username', protect, getGithubProfile)
router.post('/', protect, createUpdateProfile)
router.put('/experience', protect, addExperience)
router.put('/education', protect, AddEducation)
router.delete('/', protect, deleteProfileInfo)
router.delete('/experience/:exp_id', protect, deleteExperience)
router.delete('/education/:edu_id', protect, deleteEducation)

module.exports = router
