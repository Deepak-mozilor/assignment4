import { currentLocation, getGeocode } from "../api/wheatherApi.js";
import { refreshAll } from "../api/wheatherApi.js";

const suggestion = document.querySelector('#suggestions');
console.log('search.js running');


export async function suggest(sInput){
    try{
        console.log('suggest function running');
        let city = sInput;

        let geocode= await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
        );

        let geocodeResponse=await geocode.json();
        suggestion.textContent='';
        if (!geocodeResponse.results) return;
        for(const result of geocodeResponse.results){
            let suggestItem=`${result.name} ,${result.country}`;

            const li = document.createElement('li');
            li.textContent=suggestItem;

            suggestion.appendChild(li);
        }
    }
    catch(error){
        console.log(error);
    }
}

suggestion.addEventListener('click' , (e) =>{
        if(e.target.tagName ==='LI'){
            
            const input = document.querySelector('#city-name')
            input.value = e.target.textContent;

            getGeocode(e.target.textContent);

            input.value = '';
            suggestion.textContent='';
            const dashboard = document.querySelector('.dashboard');
            dashboard.innerHTML = '';
            currentLocation();
        }
    });

const form = document.querySelector('#city-form');

form.addEventListener('submit', (e) =>{
    const dashboard = document.querySelector('.dashboard');
    dashboard.innerHTML = '';

    suggestion.innerHTML = '';

    e.preventDefault();
    const city = document.querySelector('#city-name');
    let cityName = city.value;
    getGeocode(cityName);
    refreshAll();
    city.value = '';
});