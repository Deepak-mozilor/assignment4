import { suggest } from './search_city/search.js';
import { current_location } from './api/Wheather_api.js';

await setInterval(current_location() , 600000);

const input = document.querySelector('#city-name');

let timer;

input.addEventListener("input", (e) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        suggest(e.target.value);
    }, 300);
});

const clear=document.querySelector('#clear');

clear.addEventListener('click', () =>{
    localStorage.clear();
    document.querySelectorAll('.city-card').forEach(card => card.remove());
    current_location();
});

