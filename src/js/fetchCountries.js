export function fetchCountries(name) {
  const url = `https://restcountries.com/v3/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(data => {
    if (!data.ok) {
      throw new Error(data.status);
    }
    return data.json();
  });
}
