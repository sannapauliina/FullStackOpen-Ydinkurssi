const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

const mongoUrl = process.env.NODE_ENV === 'test'
  ? config.TEST_MONGODB_URI
  : config.MONGODB_URI

logger.info('connecting to', mongoUrl)

mongoose.connect(mongoUrl)
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error('error connecting to MongoDB:', err.message))

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app
