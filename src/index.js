import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountryInfo, DEBOUNCE_DELAY));

function searchCountryInfo(e) {
    clearMarkup()
    const searchCountry = e.target.value.trim();
    if (searchCountry !== '') {
        fetchCountries(searchCountry)
            .then(markUp)
            .catch(errorCountry);        
    }
}

function markUp(countries) {
    if (countries.length >= 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
    else if (1 < countries.length < 10) {
        countriesMarkupList(countries);
    }
    if (countries.length === 1) {
        oneCountryMarkup(countries);
    }
}

function countriesMarkupList(countries) {
    const markUpCountrieslist = countries.map(({ name, flags }) => {
            return `<li><p><img style="width: 30px; margin-right 20px" src="${flags.svg}" alt="">${name.official}</p> </li>`
        })
            .join('');
        countryList.insertAdjacentHTML('beforeend', markUpCountrieslist);
}

function oneCountryMarkup(countries) {
    const oneCountry = countries
             .map(({ name, capital, population, flags, languages }) => {
        return `
  <h1><img style="width: 30px; margin-right: 20px" src="${flags.svg}">${
          name.official
        }</h1>
  <p><span>Capital: </span>${capital}</p>
  <p><span>Population: </span>${population}</p>
  <p><span>Languages: </span>${Object.values(languages)}</p>
        `;
      })
      .join('');
        countryInfo.insertAdjacentHTML('beforeend', oneCountry)
        countryList.innerHTML = '';
}


function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function errorCountry() {
    Notiflix.Notify.failure("Oops, there is no country with that name");
}


