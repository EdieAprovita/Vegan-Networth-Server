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

const { protect } = require('../middlewares/authMiddleware')

router.get('/allPosts', protect, getAllPost)
router.get('/:id', protect, getPostById)
router.post('/createPost', protect, createPost)
router.post('/comment/:id', protect, commentPost)
router.put('/like/:id', protect, likePost)
router.put('/unlike/:id', protect, unlikePost)
router.delete('/:id', protect, deletePost)
router.delete('/comment/:id/:comment_id', protect, deleteComment)

module.exports = router