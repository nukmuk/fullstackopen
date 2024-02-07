import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState("");

  const handleAddClick = e => {
    e.preventDefault();

    if (persons.some(person => person.name === newName)) return alert(`${newName} is already in phonebook`);


    setPersons(prev => prev.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNewNumber("");
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Search value={search} onChange={setSearch} />
      <h2>add a new</h2>
      <AddForm handleAddClick={handleAddClick} newName={newName} newNumber={newNumber} onNameChange={setNewName} onNumberChange={setNewNumber} />
      <h2>Numbers</h2>
      <Persons persons={persons} searchFilter={search} />
    </div>
  )

}

const Search = ({ value, onChange }) => {
  return <p>filter shown with <input value={value} onChange={e => onChange(e.target.value)} /></p>
}

const AddForm = ({ newName, onNameChange, newNumber, onNumberChange, handleAddClick }) => {
  return <>
    <form>
      <div>
        name: <input value={newName} onChange={e => onNameChange(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={e => onNumberChange(e.target.value)} />
      </div>
      <div>
        <button type="submit" onClick={handleAddClick}>add</button>
      </div>
    </form>
  </>
}

const Persons = ({ persons, searchFilter }) => {
  return <>
    {
      persons
        .filter((person) => person.name.toLowerCase().includes(searchFilter.toLowerCase()))
        .map(person => <p key={person.name}>{person.name} {person.number}</p>)
    }
  </>
}

export default App