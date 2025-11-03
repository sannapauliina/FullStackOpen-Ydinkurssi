import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

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

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 &&
        <CountryList countries={filtered} />
      }

      {filtered.length === 1 &&
        <CountryDetails country={filtered[0]} />
      }
    </div>
  )
}

export default App
