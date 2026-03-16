import { weatherCodeToEmoji } from '../utils/weather_code.js';

export function new_card(city_value, temp_value, humidity_value, feels_like_value, wind_speed_value, weather_code_value,unit){
    const dashboard = document.querySelector('.dashboard');

    const div = document.createElement('div');
    div.className = 'city-card';

    const city_name = document.createElement('p');
    city_name.id = "city-card-name";

    const temperature = document.createElement('p');
    temperature.id = "temperature";

    const humidity = document.createElement('p');
    humidity.id = "humidity";

    const feels_like = document.createElement('p');
    feels_like.id = "feels-like-temp";

    const wind_speed = document.createElement('p');
    wind_speed.id = "wind-speed";

    const weather_code = document.createElement('p');
    weather_code.id = "weather-code";

    const remove = document.createElement('button');
    remove.textContent = 'x';
    remove.setAttribute('class','remove');
    remove.setAttribute('id',`${city_value.toLowerCase()}`);


    

    city_name.textContent = 'City : ' + city_value;
    temperature.textContent = 'Temperature : ' + temp_value + unit;
    humidity.textContent = 'humidity : ' + humidity_value + '%';
    feels_like.textContent = 'Feels Like : ' + feels_like_value + unit;
    wind_speed.textContent = 'Wind Speed 10m : ' + wind_speed_value + ' kph';
    weather_code.textContent = weatherCodeToEmoji(weather_code_value);

    div.append(city_name);
    div.append(temperature);
    div.append(humidity);
    div.append(feels_like);
    div.append(wind_speed);
    div.append(weather_code);
    div.append(remove);
    dashboard.append(div);

}

export function createSkeletonCard() {
    const card = document.createElement("div");
    card.classList.add("city-card", "skeleton");

    card.innerHTML = `
        <div class="skeleton-text city-name"></div>
        <div class="skeleton-text temp"></div>
        <div class="skeleton-text small"></div>
        <div class="skeleton-text small"></div>
        <div class="skeleton-text small"></div>
    `;

    document.querySelector(".dashboard").appendChild(card);

    return card;
}