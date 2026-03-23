import { refreshAll } from "../api/wheatherApi.js";

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

export function errorCard(error) {
    const container = document.querySelector('.dashboard');

    const card = document.createElement('div');
    card.classList.add('city-card', 'error-card');

    let type = 'generic';
    let icon = '⚠️';
    let title = 'Unknown Error';

    const message = error?.message?.toLowerCase() || '';

    // ✅ Detect City Not Found
    if (
        message.includes('not found') ||
        message.includes('unknown location') ||
        message.includes('no results')
    ) {
        type = 'not-found';
        icon = '🌐';
        title = 'City Not Found';
    }

    // ✅ Detect Network Error
    else if (
        message.includes('network') ||
        message.includes('failed to fetch') ||
        message.includes('timeout')
    ) {
        type = 'network';
        icon = '⚡';
        title = 'Network Error';
    }

    // ✅ Default fallback
    else {
        type = 'generic';
        icon = '⚠️';
        title = 'Something Went Wrong';
    }

    card.classList.add(type);

    card.innerHTML = `
        <div class="error-content">
            <div class="error-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${error?.message ?? 'Something went wrong'}</p>
            <button class="error-close">Try Again</button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector('.error-close').addEventListener('click', () => {
        card.remove();
    });
}