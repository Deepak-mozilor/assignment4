import { weatherCodeToEmoji } from '../utils/weatherCode.js';

class CityCard {
    #city;
    #unit;
    #element;

    capitalizeCity(city) {
        if (!city) return "";
        return city
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
    constructor(city, unit) {
        this.#city = this.capitalizeCity(city);
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
        const weather = weatherCodeToEmoji(weatherCode);            

        this.#element.innerHTML = `
            <div class="card-header">
                <div>
                <h2>${this.#city}</h2>
                </div>
                <button class="remove" id="${this.#city.toLowerCase()}">×</button>
            </div>

            <div class="main-weather">
                <div class="temp">
                <span class="value">${temp}</span>
                <span class="unit">${this.#unit}</span>
                </div>
                <div class="icon">${weather.emoji}</div>
            </div>

            <p class="condition">${weather.text}</p>
            <p class="feels">Feels like ${feelsLike}${this.#unit}</p>

            <div class="stats">
                <div>
                <span>💧</span>
                <strong>${humidity}%</strong>
                <p>Humidity</p>
                </div>
                <div>
                <span>🌬️</span>
                <strong>${windSpeed} km/h</strong>
                <p>Wind</p>
                </div>
                <div>
                <span>👁️</span>
                <strong>2 km</strong>
                <p>Visibility</p>
                </div>
            </div>
            `;
        return this;
    }

    buildForecast(forecastDays) {
        if (!forecastDays?.length) return this;

        const section = document.createElement('div');
        section.className = 'forecast-section';

        const grid = document.createElement('div');
        grid.className = 'forecast-grid';

        for (const day of forecastDays) {
            let weather=weatherCodeToEmoji(day.weatherCode);
            const dayEl = document.createElement('div');
            dayEl.className = 'forecast-day';
            dayEl.innerHTML = `
                <span class="forecast-date">${day.date}</span>

                <span class="forecast-icon">${weather.emoji}</span>

                <span class="forecast-temp">
                    <span class="forecast-max">${day.maxTemp}°</span>
                    <span class="forecast-min">${day.minTemp}°</span>
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

export function newCard(
    cityValue,
    tempValue,
    humidityValue,
    feelsLikeValue,
    windSpeedValue,
    weatherCodeValue,
    unit,
    forecastDays
) {
    const dashboard = document.querySelector('.dashboard');

    new CityCard(cityValue, unit)
        .buildCurrent(
            tempValue,
            humidityValue,
            feelsLikeValue,
            windSpeedValue,
            weatherCodeValue
        )
        .buildForecast(forecastDays)
        .appendTo(dashboard);
}

export function createSkeletonCard() {
    const card = document.createElement("div");
    card.classList.add("weather-card", "skeleton");

    card.innerHTML = `
        <!-- HEADER -->
        <div class="card-header">
            <div>
                <div class="skeleton-text title"></div>
                <div class="skeleton-text subtitle"></div>
            </div>
            <div class="skeleton-circle small"></div>
        </div>

        <!-- MAIN -->
        <div class="main-weather">
            <div class="skeleton-text temp"></div>
            <div class="skeleton-circle icon"></div>
        </div>

        <div class="skeleton-text line"></div>
        <div class="skeleton-text small"></div>

        <!-- STATS -->
        <div class="stats">
            <div class="stat">
                <div class="skeleton-circle tiny"></div>
                <div class="skeleton-text small"></div>
            </div>
            <div class="stat">
                <div class="skeleton-circle tiny"></div>
                <div class="skeleton-text small"></div>
            </div>
            <div class="stat">
                <div class="skeleton-circle tiny"></div>
                <div class="skeleton-text small"></div>
            </div>
        </div>

        <!-- FORECAST -->
        <div class="forecast-grid">
            ${Array.from({ length: 5 }).map(() => `
                <div class="forecast-day">
                    <div class="skeleton-text tiny"></div>
                    <div class="skeleton-circle tiny"></div>
                    <div class="skeleton-text tiny"></div>
                </div>
            `).join('')}
        </div>
    `;

    document.querySelector(".dashboard").appendChild(card);

    return card;
}