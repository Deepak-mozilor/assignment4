import { suggest } from './search_city/search.js';
import { current_location } from './api/Wheather_api.js';

localStorage.clear();
current_location();
const input = document.querySelector('#city-name');

let timer;

input.addEventListener("input", (e) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        suggest(e.target.value);
    }, 300);
});

