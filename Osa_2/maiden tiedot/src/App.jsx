import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} onBack={() => setSelectedCountry(null)} />
      ) : filtered.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filtered.length > 1 ? (
        <CountryList countries={filtered} onSelect={setSelectedCountry} />
      ) : filtered.length === 1 ? (
        <CountryDetails country={filtered[0]} />
      ) : null}
    </div>
  )
}

export default App
