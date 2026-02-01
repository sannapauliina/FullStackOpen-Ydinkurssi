const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(cors())

mongoose.set('strictQuery', false)

console.log('BACKEND NODE_ENV:', process.env.NODE_ENV)

const mongoUrl =
  process.env.NODE_ENV === 'test'
    ? config.TEST_MONGODB_URI
    : config.MONGODB_URI

logger.info('connecting to MongoDB')

mongoose.connect(mongoUrl)
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error('error connecting to MongoDB:', err.message))

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
