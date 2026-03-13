


export function new_card(city_value, temp_value, humidity_value, feels_like_value, wind_speed_value, weather_code_value){
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


    city_name.textContent = 'City : ' + city_value;
    temperature.textContent = 'Temperature : ' + temp_value;
    humidity.textContent = 'humidity : ' + humidity_value;
    feels_like.textContent = 'Feels Like : ' + feels_like_value;
    wind_speed.textContent = 'Wind Speed 10m : ' + wind_speed_value;
    weather_code.textContent = 'Weather Code : ' + weather_code_value;

    div.append(city_name);
    div.append(temperature);
    div.append(humidity);
    div.append(feels_like);
    div.append(wind_speed);
    div.append(weather_code);
    dashboard.append(div);
}