const Post = require('../models/Post')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

exports.createPost = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id)

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		})

		const post = await newPost.save()
		res.status(200).json(post)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.getAllPost = asyncHandler(async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 })
		res.status(200).json(posts)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.getPostById = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) {
			return res.status(404).json({ message: 'Post not found' })
		}

		res.status(200).json(post)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deletePost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) {
			return res.status(404).json({ message: 'Post not found' })
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' })
		}

		await post.remove()

		res.status(200).json({ message: 'Post removed' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.likePost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (post.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ message: 'Post already liked' })
		}

		post.likes.unshift({ user: req.user.id })

		await post.save()

		return res.json(post.likes)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.unlikePost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ message: 'Post has not yet been liked' })
		}

		post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id)

		await post.save()

		return res.json(post.likes)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.commentPost = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		const post = await Post.findById(req.params.id)

		const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		}

		post.comments.unshift(newComment)

		await post.save()

		res.status(200).json(post.comments)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteComment = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		const comment = post.comments.find(comment => comment.id === req.params.commentid)

		if (!comment) {
			return res.status(404).json({ message: 'Comment does not exist' })
		}

		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' })
		}

		post.comments = post.comments.filter(({ id }) => id !== req.params.commentsid)

		await post.save()

		return res.status(200).json(post.comments)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
