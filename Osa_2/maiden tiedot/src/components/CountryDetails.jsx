const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
    </ul>
    <img src={country.flags.png} alt="flag" width="150" />
  </div>
)

export default CountryDetails
