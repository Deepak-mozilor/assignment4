import { suggest } from './search_city/search.js';
import { current_location } from './api/Wheather_api.js';

current_location();
await setInterval(current_location, 600000);
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

const unit_btn = document.querySelector('.unit');

unit_btn.addEventListener('click', () =>{
    if(unit_btn.id === 'celcius'){
        unit_btn.setAttribute('id','fahrenheit');
    }
    else{
        unit_btn.setAttribute('id','celcius');
    }
    document.querySelectorAll('.city-card').forEach(card => card.remove());
    current_location();
});
