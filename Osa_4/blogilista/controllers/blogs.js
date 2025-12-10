const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const saved = await blog.save()
    logger.info('New blog saved:', saved.title, 'by', saved.author)
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
