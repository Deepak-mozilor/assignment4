import { refreshAll } from "../api/Wheather_api.js";

export class WeatherError extends Error {
    #statusCode;

    constructor(message, statusCode = 0) {
        super(message);
        this.name = 'WeatherError';
        this.#statusCode = statusCode;
    }

    get statusCode() {
        return this.#statusCode;
    }

    toString() {
        return `[${this.name}] (${this.#statusCode}): ${this.message}`;
    }
}

export function error_card(error) {
    const container = document.querySelector('.dashboard');

    const card = document.createElement('div');
    card.classList.add('city-card', 'error-card');

    let type = 'generic';
    let icon = '⚠️';
    let title = 'Error';

    console.log(error.statusCode);
    if (error instanceof WeatherError) {
        if (error.statusCode === 404) {
            type = 'not-found';
            icon = '🌐';
            title = 'City Not Found';
        } else if (error.statusCode >= 500) {
            type = 'network';
            icon = '⚡';
            title = 'Network Error';
        }
    }

    card.classList.add(type);

    const message = error?.message ?? 'Something went wrong';

    card.innerHTML = `
        <div class="error-content">
            <div class="error-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="error-close">Try Again</button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector('.error-close').addEventListener('click', () => {
        card.remove();
        refreshAll();
    });
}