import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country, onBack }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  const [error, setError] = useState(null)

  useEffect(() => {
    const capital = country.capital[0]
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`

    axios.get(url).then(response => {
      setWeather(response.data)
      setError(null)
    })
    .catch(err => {
      console.error('Weather data retrieval failed:', err)
      setError('Weather data could not be retrieved.')
    })
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" width="150" />
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
      {onBack && <button onClick={onBack}>Back</button>}
    </div>
  )
}

export default CountryDetails
