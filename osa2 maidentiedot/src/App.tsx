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
  latlng: [number, number];
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
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if (props.countries.length !== 1) return setWeather(null);
    const country = props.countries[0];
    const fetchData = async () => {
      const weather = await getTemperature(
        country.latlng[0],
        country.latlng[1]
      );
      setWeather(weather);
    };
    fetchData();
  }, [props.countries]);

  if (props.countries.length > 10 && props.search !== "") {
    return <p>Too many countries, specify another filter</p>;
  } else if (props.countries.length === 1) {
    const country = props.countries[0];
    const languages: string[] = [];
    for (const l in country.languages) {
      languages.push(country.languages[l]);
    }

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital.join(", ")}</p>
        <h3>languages: </h3>
        {languages.map((l) => (
          <li>{l}</li>
        ))}
        <br />
        <img src={country.flags.svg} alt={country.flags.alt}></img>

        <h1>Weather in {country.name.common}</h1>
        <p>temperature {weather?.temperature} Celsius</p>
        <p>wind {weather?.wind} m/s</p>
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

type Weather = {
  temperature: number;
  wind: number;
};

async function getTemperature(lat: number, long: number): Promise<Weather> {
  type MeteoResult = {
    current: {
      temperature_2m: number;
      wind_speed_10m: number;
    };
  };

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m`
  );
  const result = (await res.json()) as MeteoResult;
  const weather = {
    temperature: result.current.temperature_2m,
    wind: result.current.wind_speed_10m,
  } as Weather;
  console.log(lat, long);
  return weather;
}

export default App;
