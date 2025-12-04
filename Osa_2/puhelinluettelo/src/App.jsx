import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const Notification = ({ message, type }) => {
  if (message === null) return null

  return (
    <div className={type === 'error' ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with: <input
      value={filter}
      onChange={handleFilterChange}
    />
  </div>
)

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  handleSubmit
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map(person =>
      <li key={person.id}>
        {person.name} {person.number} {''}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </li>
    )}
  </div>
)

const App = () => {
  
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmUpdate) return

      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationType('success')
          setNotification(`Updated number for ${returnedPerson.name}`)
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          console.error('PUT failed:', error)
          setNotificationType('error')
          setNotification(`Information of ${newName} has already been removed from server`)
          setTimeout(() => setNotification(null), 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationType('success')
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => setNotification(null), 5000)
        })
    }
  }

  const handleDelete = (id, name) => {
    const confirm = window.confirm(`Delete ${name}?`)
    if (!confirm) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotificationType('success')
        setNotification(`Deleted ${name}`)
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        setNotificationType('error')
        setNotification(`${name} has already been removed from the server`)
        setTimeout(() => setNotification(null), 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
    }

  const normalizedFilter = filter ? filter.toLowerCase() : ''
  const filteredPersons = persons.filter(
    p => p.name && p.name.toLowerCase().includes(normalizedFilter)
  )
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <Notification message={notification} type={notificationType} />
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />
      <h3>Add a new</h3>
        <PersonForm
          newName={newName}
          newNumber={newNumber}
          handleNameChange={(e) => setNewName(e.target.value)}
          handleNumberChange={(e) => setNewNumber(e.target.value)}
          handleSubmit={handleSubmit}
        />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App