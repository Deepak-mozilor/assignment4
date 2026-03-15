import { new_card } from '../main_content/content.js';
import { createSkeletonCard } from '../main_content/content.js';
import { remove_btn } from '../utils/remove.js';
import { error_card } from '../errors/error_card.js';
import { to_fahrenheit } from "../utils/unit_converter.js";

export async function get_data(lat,long,city) {
    try{
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];
        const skeleton = createSkeletonCard();

        let weather_response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`);

        let data = await weather_response.json();
        
        let temp = data.current.temperature_2m;
        let humidity = data.current.relative_humidity_2m;
        let feels_like = data.current.apparent_temperature;
        let wind_speed = data.current.wind_speed_10m;
        let weather_code = data.current.weather_code;

        skeleton.remove();

        const unit_btn = document.querySelector('.unit');
        let unit = '°C';
        if(unit_btn.id === 'fahrenheit'){
            unit = '°F';
            temp = Math.floor(to_fahrenheit(temp));
            feels_like = Math.floor(to_fahrenheit(feels_like));
        }

        new_card(city,temp,humidity,feels_like,wind_speed,weather_code,unit);
        remove_btn();

        
        localStorage.setItem('store_city',JSON.stringify(city_arr));
    }
    catch(error){
        error_card(error);
    }
}

export async function get_geocode(city) {
    try{
        console.log('get_geocode function started');
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];

        const normalizedCity = city.split(',')[0].trim().toLowerCase();
        
        let geocode_response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${normalizedCity}&count=10&language=en&format=json`
        );

        let geocode = await geocode_response.json();
        let lat = geocode.results[0].latitude;
        let long = geocode.results[0].longitude;

        

        if (city_arr.some(item => item.city === normalizedCity)) {
            alert("City already present");
            return;
        }

        city_arr.push({latitude : lat, longitude : long, city:normalizedCity});

        localStorage.setItem('store_city',JSON.stringify(city_arr));
        get_data(lat,long,city);
        
    }
    catch(error){
        console.log(error);
    }
}
//current location cannot be found by open meteo.
export async function current_location(){
    try{
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];

        if (city_arr.length===0){
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
            
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                );
            
                const data = await response.json();
            
                const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.municipality;

                console.log(data.address);
            
                get_geocode(city);
            });
        }

        else{
            for (let items of city_arr){
                await get_data(items.latitude, items.longitude, items.city, city_arr);
            }
        }
    }
    catch(error){
        console.log(error);
    }
}




