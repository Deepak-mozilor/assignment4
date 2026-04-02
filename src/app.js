import { suggest } from './searchCity/search.js';
import { currentLocation, createAutoRefresh ,report} from './api/wheatherApi.js';
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

clear.addEventListener('click', async() => {
    let res=await fetch("http://127.0.0.1:8000/cleardb",{
        method : 'GET',
        credentials : 'include'
    });

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

const reportBtn = document.querySelector('#report');

reportBtn.addEventListener('click', () =>{
    report();
})