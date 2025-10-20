import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '050 555 7678' }
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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
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
        {persons.map(person => (
          <li key={person.name}>
            {person.name} - {person.number}
          </li>
        ))}
      </div>
    </div>
  )

}

export default App