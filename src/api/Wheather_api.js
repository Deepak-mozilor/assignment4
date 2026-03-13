import { new_card } from '../main_content/content.js';


async function get_data(lat,long,city,city_arr) {
    try{
        let weather_response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`);

        let data = await weather_response.json();
        
        let temp = data.current.temperature_2m;
        let humidity = data.current.relative_humidity_2m;
        let feels_like = data.current.apparent_temperature;
        let wind_speed = data.current.wind_speed_10m;
        let weather_code = data.current.weather_code;

        
        new_card(city,temp,humidity,feels_like,wind_speed,weather_code);
        
        localStorage.setItem('store_city',JSON.stringify(city_arr));
    }
    catch(error){
        console.log(error);
    }
}

export async function get_geocode(city) {
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
        localStorage.setItem('store_city', JSON.stringify(city_arr));
        get_data(lat,long,city,city_arr);
        
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
                    //since open meteo does not provide city name. the below link is given by chatgpt. 
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                );
            
                const data = await response.json();
            
                const city = data.address.city;
            
                get_geocode(city);
            });
        }

        else{
            for (let items of city_arr){
                get_data(items.latitude, items.longitude, items.city, city_arr);
            }
        }
    }
    catch(error){
        console.log(error);
    }
}




