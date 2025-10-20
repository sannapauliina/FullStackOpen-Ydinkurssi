import { useState } from 'react'

const App = () => {
  const [filter, setFilter] = useState('')

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '050-5557678' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumeber] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { 
      name: newName,
      number: newNumber
   }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumeber('')  
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <h2>Add a new</h2>
        <div>
          name: <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)} 
          />
        </div>
        <div>
          number: <input
          value={newNumber}
          onChange={(e) => setNewNumeber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map(person => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ))}
      </div>
    </div>
  )

}

export default App