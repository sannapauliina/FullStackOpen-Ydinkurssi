import { useState } from 'react'

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

const Persons = ({ persons }) => (
  <div>
    {persons.map(person => (
      <li key={person.name}>
        {person.name} {person.number}
      </li>
    ))}
  </div>
)

const App = () => {
  
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '050-5557678' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, number: newNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }  

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
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
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App