import { suggest } from './searchCity/search.js';
import { currentLocation, createAutoRefresh } from './api/wheatherApi.js';
import { createSkeletonCard } from './mainContent/content.js';
import { emptyDashboard } from './mainContent/emptyContent.js';

createSkeletonCard();
currentLocation();

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
    emptyDashboard();
});

const unitBtn= document.querySelector('.unit-btn');

unitBtn.addEventListener('click', () => {
    if (unitBtn.id === 'celsius') {
        unitBtn.id = 'fahrenheit';
    } else {
        unitBtn.id = 'celsius';
    }

    document.querySelectorAll('.city-card').forEach(card => card.remove());

    createSkeletonCard();
    currentLocation();
});

