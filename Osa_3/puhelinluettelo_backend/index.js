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

// GET
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    console.log('Fetched persons:', persons.length)
    res.json(persons)
  })
})

// POST
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('POST request received:', body)

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log('Saved to DB:', savedPerson)
    response.json(savedPerson)
  })
})

// GET yksittäinen id
app.get('/api/persons/:id', (req, res) => {
  res.status(501).send({ error: 'Not implemented yet' })
})

// DELETE yksittäinen id
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  console.log('DELETE request received, id:', id)

  Person.findByIdAndDelete(id).then(() => {
    console.log('Deleted person with id:', id)
    res.status(204).end()
  })
})

// INFO
app.get('/info', (req, res) => {
  res.status(501).send({ error: 'Not implemented yet' })

  // Vanha toteutus:
  // const date = new Date()
  // const offset = -date.getTimezoneOffset()
  // const sign = offset >= 0 ? '+' : '-'
  // const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  // const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
  // const gmt = `GMT${sign}${hours}${minutes}`
  //
  // const tzName = new Intl.DateTimeFormat('en-US', {
  //   timeZone: 'Europe/Helsinki',
  //   timeZoneName: 'long'
  // }).format(date).split(', ')[1]
  //
  // const finalString = `${date.toDateString()} ${date.toTimeString().split(' ')[0]} ${gmt} (${tzName})`
  //
  // res.send(`
  //   <p>Phonebook has info for ${count} people</p>
  //   <p>${finalString}</p>
  // `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

