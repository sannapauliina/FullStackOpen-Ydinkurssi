const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

const User = require('../models/user')
const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    // hae joku käyttäjä
    const users = await User.find({})
    const user = users[0]

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    // lisää blogi käyttäjän blogs-listaan
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)

    if (!deletedBlog) {
      const error = new Error('blog not found')
      error.status = 404
      return next(error)
    }

    res.status(204).end()
  } catch (error) {
    error.status = 400
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
