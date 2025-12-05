require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()

const Person = require('./models/person')

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist')) 

// GET
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      console.log('Fetched persons:', persons.length)
      res.json(persons)
    })
    .catch(error => next(error))
})

// POST
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// GET yksittäinen id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE yksittäinen id
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
    })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// INFO
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()

      // GMT offset
      const offset = -date.getTimezoneOffset()
      const sign = offset >= 0 ? '+' : '-'
      const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
      const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
      const gmt = `GMT${sign}${hours}${minutes}`

      const tzName = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Helsinki',
        timeZoneName: 'long'
      }).format(date).split(', ')[1]

      const finalString = `${date.toDateString()} ${date.toTimeString().split(' ')[0]} ${gmt} (${tzName})`

      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${finalString}</p>
      `)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

