import { suggest } from './search_city/search.js';
import { current_location, createAutoRefresh } from './api/Wheather_api.js';
import { createSkeletonCard } from './main_content/content.js';

createSkeletonCard();
current_location();

const autoRefresh = createAutoRefresh(600000);
autoRefresh.start();

const input = document.querySelector('#city-name');

let timer;
input.addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        suggest(e.target.value);
    }, 300);
});

const clear = document.querySelector('#clear');

clear.addEventListener('click', () => {
    localStorage.clear();
    document.querySelectorAll('.city-card').forEach(card => card.remove());
    current_location();
});

const unit_btn = document.querySelector('.unit');

unit_btn.addEventListener('click', () => {
    if (unit_btn.id === 'celsius') {
        unit_btn.id = 'fahrenheit';
    } else {
        unit_btn.id = 'celsius';
    }

    document.querySelectorAll('.city-card').forEach(card => card.remove());

    createSkeletonCard();
    current_location();
});