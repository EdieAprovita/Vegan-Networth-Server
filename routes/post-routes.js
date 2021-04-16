const express = require('express')
const router = express.Router()

const {
	createPost,
	getAllPost,
	getPostById,
	deletePost,
	likePost,
	unlikePost,
	commentPost,
	deleteComment,
} = require('../controllers/posts-controllers')

const auth = require('../middlewares/authMiddleware')

router.get('/', auth, getAllPost)
router.get('/:id', auth, getPostById)
router.post('/', auth, createPost)
router.post('/comment/:id', auth, commentPost)
router.put('/like/:id', auth, likePost)
router.put('/unlike/:id', auth, unlikePost)
router.delete('/:id', auth, deletePost)
router.delete('/comment/:id/:comment_id', auth, deleteComment)

module.exports = router
