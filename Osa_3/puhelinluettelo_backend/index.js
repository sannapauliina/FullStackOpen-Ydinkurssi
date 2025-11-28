require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()

const Person = require('./models/person')

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist')) 

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end() // 204 no content
  } else {
    res.status(404).end() // 404 not found
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const nameExists = persons.find(p => p.name === body.name)
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()

  // GMT offset ( +0200 )
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
  const gmt = `GMT${sign}${hours}${minutes}`

  // Aikavyöhyke
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
