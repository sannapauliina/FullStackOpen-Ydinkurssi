const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  console.log('TOKEN:', req.token)
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    console.log('DECODED TOKEN:', decodedToken)
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    req.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    next(error)
  }
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    // uniikki username rikki
    return res.status(400).json({ error: 'username must be unique' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor, 
  userExtractor
}

