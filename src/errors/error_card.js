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

    const message = error?.message ?? 'An unknown error occurred';
    const code = error instanceof WeatherError ? ` (Code: ${error.statusCode})` : '';

    card.innerHTML = `
        <div class="error-content">
            <h3>⚠ Error</h3>
            <p>${message}${code}</p>
            <button class="error-close">Close</button>
        </div>
    `;

    container.appendChild(card);

    card.querySelector('.error-close').addEventListener('click', () => {
        card.remove();
    });
}