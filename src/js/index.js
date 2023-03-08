import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const notificationInfo =
  'Too many matches found. Please enter a more specific name.';
const errorText = 'Oops, there is no country with that name';
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const clearCountryInfo = () => {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};

refs.input.addEventListener('input', debounce(getCountries, DEBOUNCE_DELAY));

function getCountries(e) {
  const name = e.target.value;
  console.log(name);

  if (name == '') {
    clearCountryInfo();
    return;
  }

  fetchCountries(name.trim())
    .then(countries => renderCounrtriesList(countries))
    .catch(() => {
      Notify.failure(errorText);
      clearCountryInfo();
    });
}

function showCountryInfo(country) {
    const languagesArray = Object.values(country.languages);
  console.log(languagesArray);
  
    const languages = languagesArray.join(", ");
    const markup = `
      <div class="flag">
        <img src=${country.flags[0]} alt ="country flag" height="30" width="45">
        <h2>${country.name.official}</h2>
      </div>
      <p><span class="info-title">Capital:</span> ${country.capital}</p>
      <p><span class="info-title">Population:</span> ${country.population}</p>
      <p><span class="info-title">Languages:</span> ${languages}</p>`;
    
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = markup;
}

function showCountryList(countries) {
  const markup = countries
    .map(country => `
      <li class="flag">
        <img src=${country.flags[0]} alt ="country flag" height="20" width="35">
        <p>${country.name.official}</p>
      </li>`)
    .join('');
  
  refs.countryList.innerHTML = markup;
  refs.countryInfo.innerHTML = '';
}

function renderCounrtriesList(countries) {
  if (countries.length === 1) {
    showCountryInfo(countries[0]);
  }
  else if (countries.length >= 2 && countries.length <= 10) {
    showCountryList(countries);
  }
  else {
    Notify.info(notificationInfo);
    clearCountryInfo();
  }
}
