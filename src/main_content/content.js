import { weatherCodeToEmoji } from '../utils/weather_code.js';

class CityCard {
    #city;
    #unit;
    #element;

    constructor(city, unit) {
        this.#city = city;
        this.#unit = unit;
        this.#element = document.createElement('div');
        this.#element.className = 'city-card';
    }

    get city() {
        return this.#city;
    }

    get element() {
        return this.#element;
    }

    buildCurrent(temp, humidity, feelsLike, windSpeed, weatherCode) {
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.setAttribute('class', 'remove');
        removeBtn.setAttribute('id', `${this.#city.toLowerCase()}`);

        this.#element.innerHTML = `
            <p id="city-card-name">City : ${this.#city}</p>
            <p id="weather-code">${weatherCodeToEmoji(weatherCode)}</p>
            <p id="temperature">Temperature : ${temp}${this.#unit}</p>
            <p id="humidity">Humidity : ${humidity}%</p>
            <p id="feels-like-temp">Feels Like : ${feelsLike}${this.#unit}</p>
            <p id="wind-speed">Wind Speed 10m : ${windSpeed} kph</p>
        `;
        this.#element.appendChild(removeBtn);

        return this;
    }

    buildForecast(forecastDays) {
        if (!forecastDays?.length) return this;

        const section = document.createElement('div');
        section.className = 'forecast-section';

        const title = document.createElement('p');
        title.className = 'forecast-title';
        title.textContent = '5-Day Forecast';
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'forecast-grid';

        for (const day of forecastDays) {
            const dayEl = document.createElement('div');
            dayEl.className = 'forecast-day';
            dayEl.innerHTML = `
                <span class="forecast-date">${day.date}</span>
                <span class="forecast-icon">${weatherCodeToEmoji(day.weatherCode)}</span>
                <span class="forecast-temp">
                    <span class="forecast-max">${day.maxTemp}${this.#unit}</span>
                    <span class="forecast-min">${day.minTemp}${this.#unit}</span>
                </span>
            `;
            grid.appendChild(dayEl);
        }

        section.appendChild(grid);
        this.#element.appendChild(section);

        return this;
    }

    appendTo(container) {
        container.appendChild(this.#element);
        return this;
    }
}

export function new_card(city_value, temp_value, humidity_value, feels_like_value, wind_speed_value, weather_code_value, unit, forecastDays) {
    const dashboard = document.querySelector('.dashboard');

    new CityCard(city_value, unit)
        .buildCurrent(temp_value, humidity_value, feels_like_value, wind_speed_value, weather_code_value)
        .buildForecast(forecastDays)
        .appendTo(dashboard);
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
        <div class="skeleton-text forecast-placeholder"></div>
    `;

    document.querySelector(".dashboard").appendChild(card);

    return card;
}