const express = require('express')
const app = express()

const persons = [
  { id: "1", name: "Arto Hellas", number: "050-12345678" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
