import { useEffect, useState } from "react";
import axios from "axios";
import numbers from "./services/numbers";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((persons) => {
      setPersons(persons.data);
    });
  }, []);

  const handleAddClick = async (e) => {
    e.preventDefault();

    const newPerson = { name: newName, number: newNumber };

    if (persons.some((person) => person.name === newName)) {
      if (confirm(`${newName} is already in phonebook, replace old number?`)) {
        const person = persons.find((person) => person.name === newName);
        await numbers.update(person.id, newPerson);
        setNewName("");
        setNewNumber("");
      } else {
        return;
      }
    } else {
      await numbers.add(newPerson);
    }

    // setPersons((prev) => prev.concat(newPerson));
    numbers.getAll().then((getData) => {
      console.log(getData);
      setPersons(getData);
    });
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Search value={search} onChange={setSearch} />
      <h2>add a new</h2>
      <AddForm
        handleAddClick={handleAddClick}
        newName={newName}
        newNumber={newNumber}
        onNameChange={setNewName}
        onNumberChange={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchFilter={search}
        setPersons={setPersons}
      />
    </div>
  );
};

const Search = ({ value, onChange }) => {
  return (
    <p>
      filter shown with{" "}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </p>
  );
};

const AddForm = ({
  newName,
  onNameChange,
  newNumber,
  onNumberChange,
  handleAddClick,
}) => {
  return (
    <>
      <form>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => onNumberChange(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" onClick={handleAddClick}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

const Persons = ({ persons, searchFilter, setPersons }) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        .map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{" "}
            <button
              onClick={() => {
                if (!confirm(`are you sure you want to delete ${person.name}?`))
                  return;
                numbers.remove(person.id);
                setPersons((prev) =>
                  prev.filter((listPerson) => listPerson.id !== person.id)
                );
              }}
            >
              delete
            </button>
          </p>
        ))}
    </>
  );
};

export default App;
