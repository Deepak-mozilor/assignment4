import { get_geocode } from "../api/Wheather_api.js";
import { refreshAll } from "../api/Wheather_api.js";

const suggestion = document.querySelector('#suggestions');
console.log('search.js running');


export async function suggest(s_input){
    try{
        console.log('suggest function running');
        let city = s_input;

        let geocode= await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
        );

        let geocode_response=await geocode.json();
        suggestion.textContent='';
        if (!geocode_response.results) return;
        for(const result of geocode_response.results){
            let suggest_item=`${result.name} ,${result.country}`;

            const li = document.createElement('li');
            li.textContent=suggest_item;

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

            get_geocode(e.target.textContent);

            input.value = '';
            suggestion.textContent='';
            const dashboard = document.querySelector('.dashboard');
            dashboard.innerHTML = '';
            refreshAll();
        }
    });

const form = document.querySelector('#city-form');

form.addEventListener('submit', (e) =>{
    const dashboard = document.querySelector('.dashboard');
    dashboard.innerHTML = '';

    suggestion.innerHTML = '';

    e.preventDefault();
    const city = document.querySelector('#city-name');
    let city_name = city.value;
    get_geocode(city_name);
    refreshAll();
    city.value = '';
});