import { useEffect, useState } from "react";
import axios from "axios";
import numbers from "./services/numbers";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([
    // { message: "some error happened...", isError: true },
  ]);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((persons) => {
      setPersons(persons.data);
    });
  }, []);

  const handleAddClick = async (e) => {
    e.preventDefault();

    const newPerson = { name: newName, number: newNumber };

    if (persons.some((person) => person.name === newName)) {
      if (!confirm(`${newName} is already in phonebook, replace old number?`))
        return;
      const person = persons.find((person) => person.name === newName);
      try {
        await numbers.update(person.id, newPerson);
        updatePersons(setPersons);
        successfulAdd(
          showNotification,
          setNotifications,
          newName,
          setNewName,
          setNewNumber
        );
      } catch (e) {
        console.log("err", e);
        showNotification(
          {
            message: `${person.name} has already been removed from server`,
            isError: true,
          },
          setNotifications
        );
      }
    } else {
      await numbers.add(newPerson);

      updatePersons(setPersons);
      successfulAdd(
        showNotification,
        setNotifications,
        newName,
        setNewName,
        setNewNumber
      );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notifications.map((notification) => (
        <Notification
          key={notification.message}
          message={notification.message}
          isError={notification.isError}
        />
      ))}
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
        setNotifications={setNotifications}
      />
    </div>
  );
};

function successfulAdd(
  showNotification,
  setNotifications,
  newName,
  setNewName,
  setNewNumber
) {
  showNotification(
    {
      message: `Added ${newName}`,
    },
    setNotifications
  );

  setNewName("");
  setNewNumber("");
}

function updatePersons(setPersons) {
  numbers.getAll().then((getData) => {
    console.log(getData);
    setPersons(getData);
  });
}

function showNotification(newNotification, setNotifications) {
  setNotifications((prev) => prev.concat(newNotification));

  setTimeout(() => {
    setNotifications((prev) =>
      prev.filter((listItem) => listItem !== newNotification)
    );
  }, 5000);
}

const Notification = ({ message, isError }) => {
  return (
    message && (
      <>
        <div className={`notification ${isError && "error"}`}>{message}</div>
      </>
    )
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

function handleDelete(person, setPersons, setNotifications) {
  if (!confirm(`are you sure you want to delete ${person.name}?`)) return;
  numbers
    .remove(person.id)
    .then(() => {
      setPersons((prev) =>
        prev.filter((listPerson) => listPerson.id !== person.id)
      );
      showNotification({ message: `Removed ${person.name}` }, setNotifications);
    })
    .catch(() => {
      showNotification(
        {
          message: `${person.name} has already been removed from server`,
          isError: true,
        },
        setNotifications
      );
      updatePersons(setPersons);
    });
}

const Persons = ({ persons, searchFilter, setPersons, setNotifications }) => {
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
              onClick={() => handleDelete(person, setPersons, setNotifications)}
            >
              delete
            </button>
          </p>
        ))}
    </>
  );
};

export default App;
