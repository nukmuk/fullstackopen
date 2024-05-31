import { useEffect, useState } from "react";
// import "./reset.css";
import "./App.css";

type Country = {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  languages: Record<string, string>;
  flags: {
    alt: string;
    png: string;
    svg: string;
  };
};

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Country[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        "https://studies.cs.helsinki.fi/restcountries/api/all"
      );
      const json = await result.json();
      console.log(json[0]);
      setCountries(json);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = countries.filter((c) =>
      c.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
  }, [search]);

  return (
    <>
      <div>
        find countries{" "}
        <input
          value={search}
          onInput={(e) => {
            setSearch(e.currentTarget.value);
          }}
        ></input>
      </div>
      <CountryList
        countries={searchResults}
        setSearch={setSearch}
        search={search}
      />
    </>
  );
}

function Country(props: {
  country: Country;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const clickHandler = () => {
    props.setSearch(props.country.name.common);
  };
  return (
    <div className="country">
      <p>{props.country.name.common}</p>{" "}
      <button onClick={clickHandler}>show</button>
      <br />
    </div>
  );
}

function CountryList(props: {
  countries: Country[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
}) {
  if (props.countries.length > 10 && props.search !== "") {
    return <p>Too many countries, specify another filter</p>;
  } else if (props.countries.length === 1) {
    const c = props.countries[0];
    const languages: string[] = [];
    for (const l in c.languages) {
      languages.push(c.languages[l]);
    }

    return (
      <div>
        <h1>{c.name.common}</h1>
        <p>capital {c.capital.join(", ")}</p>
        <h3>languages: </h3>
        {languages.map((l) => (
          <li>{l}</li>
        ))}
        <img src={c.flags.svg} alt={c.flags.alt}></img>
      </div>
    );
  } else {
    return (
      <div>
        {props.countries.map((c) => {
          return <Country country={c} setSearch={props.setSearch} />;
        })}
      </div>
    );
  }
}

export default App;
