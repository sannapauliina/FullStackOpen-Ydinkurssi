const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

const User = require('../models/user')
const blogsRouter = express.Router()
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  console.log('USER IN REQUEST:', req.user)

  try {
    const body = req.body
    const user = req.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    // lisää blogi käyttäjän listaan
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    // Vain lisääjä saa poistaa
    if (blog.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'only the creator can delete a blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    return res.status(204).end()

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { likes } = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedBlog) {
      const error = new Error('blog not found')
      error.status = 404
      return next(error)
    }

    res.json(updatedBlog)
  } catch (error) {
    error.status = 400
    next(error)
  }
})

module.exports = blogsRouter
