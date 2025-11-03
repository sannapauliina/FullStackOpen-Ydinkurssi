const CountryList = ({ countries, onSelect }) => (
  <ul>
    {countries.map(country => (
      <li key={country.cca3}>
        {country.name.common}{' '}
        <button onClick={() => onSelect(country)}>Show</button>
      </li>
    ))}
  </ul>
)

export default CountryList

