import { newCard } from '../mainContent/content.js';
import { removeBtn } from '../utils/remove.js';
import { errorCard, WeatherError } from '../errors/errorCard.js';
import { toFahrenheit } from "../utils/unitConverter.js";

// --- Forecast helpers ---

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function parseForecast(daily, unitBtn) {
    const isFahrenheit = unitBtn?.id === 'fahrenheit';

    return daily.time.map((dateStr, i) => {
        let maxTemp = Math.floor(daily.temperature_2m_max?.[i] ?? 0);
        let minTemp = Math.floor(daily.temperature_2m_min?.[i] ?? 0);

        if (isFahrenheit) {
            maxTemp = Math.floor(toFahrenheit(maxTemp));
            minTemp = Math.floor(toFahrenheit(minTemp));
        }

        return {
            date: formatDate(dateStr),
            maxTemp,
            minTemp,
            weatherCode: daily.weatherCode?.[i] ?? 0,
        };
    });
}

// --- Core data fetching ---

export async function getData(lat, long, city) {
    try {
        const cityArr = JSON.parse(localStorage.getItem('storeCity')) || [];
        const skeleton = document.querySelector('.skeleton');

        // Fetch current weather AND 5-day daily forecast in parallel
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`),
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto`)
        ]);

        if (!currentRes.ok) {
            throw new WeatherError(`Weather fetch failed for ${city}`, currentRes.status);
        }

        if (!forecastRes.ok) {
            throw new WeatherError(`Forecast fetch failed for ${city}`, forecastRes.status);
        }

        const data = await currentRes.json();
        const forecastData = await forecastRes.json();

        // Optional chaining on all data accesses
        const tempRaw = data.current?.temperature_2m ?? 0;
        const humidity = data.current?.relative_humidity_2m ?? 0;
        const feelsLikeRaw = data.current?.apparent_temperature ?? 0;
        const windSpeed = data.current?.windSpeed_10m ?? 0;
        const weatherCode = data.current?.weatherCode ?? 0;

        skeleton?.remove();

        const unitBtn= document.querySelector('.unit-btn');
        let unit = '°C';
        let temp = Math.floor(tempRaw);
        let feelsLike = Math.floor(feelsLikeRaw);

        if (unitBtn?.id === 'fahrenheit') {
            unit = '°F';
            temp = Math.floor(toFahrenheit(tempRaw));
            feelsLike = Math.floor(toFahrenheit(feelsLikeRaw));
        }

        // Parse 5-day forecast
        const forecastDays = forecastData.daily ? parseForecast(forecastData.daily, unitBtn) : [];

        newCard(city, temp, humidity, feelsLike, windSpeed, weatherCode, unit, forecastDays);
        removeBtn();

        localStorage.setItem('storeCity', JSON.stringify(cityArr));
    } catch (error) {
        let weatherError;

        if (error instanceof TypeError) {
            weatherError = new WeatherError(
                "Network error. Please check your connection.",
                0
            );
        } else if (error instanceof WeatherError) {
            weatherError = error;
        } else {
            weatherError = new WeatherError(
                error?.message ?? 'Unknown error',
                500 
            );
        }

        errorCard(weatherError);
    }
}

export async function getGeocode(city) {
    try {
        const cityArr = JSON.parse(localStorage.getItem('storeCity')) || [];
        const normalizedCity = city.split(',')[0].trim().toLowerCase();

        const geocodeResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${normalizedCity}&count=10&language=en&format=json`
        );

        if (!geocodeResponse.ok) {
            throw new WeatherError(`Geocode fetch failed for "${normalizedCity}"`, geocodeResponse.status);
        }

        const geocode = await geocodeResponse.json();

        // Optional chaining on results
        const lat = geocode.results?.[0]?.latitude;
        const long = geocode.results?.[0]?.longitude;

        if (lat == null || long == null) {
            throw new WeatherError(`City "${normalizedCity}" not found`);
        }

        if (cityArr.some(item => item.city === normalizedCity)) {
            alert("City already present");
            return;
        }

        cityArr.push({ latitude: lat, longitude: long, city: normalizedCity });
        localStorage.setItem('storeCity', JSON.stringify(cityArr));

        getData(lat, long, city);
    } catch (error) {
        const weatherError = error instanceof WeatherError
            ? error
            : new WeatherError(error?.message ?? 'Unknown geocode error');
        errorCard(weatherError);
    }
}

// --- Promise.allSettled: refresh all cities independently ---

export async function refreshAll() {
    const cityArr = JSON.parse(localStorage.getItem('storeCity')) || [];

    if (cityArr.length === 0) return;

    document.querySelector('.dashboard').innerHTML = '';

    const results = await Promise.allSettled(
        cityArr.map(item => getData(item.latitude, item.longitude, item.city))
    );

    results.forEach((result, i) => {
        if (result.status === 'rejected') {
            const city = cityArr[i]?.city ?? 'unknown';
            console.warn(`Failed to refresh "${city}":`, result.reason);
        }
    });
}



export function createAutoRefresh(intervalMs = 600000) {
    let intervalId = null;

    function start() {
        intervalId = setInterval(() => {
            refreshAll();
        }, intervalMs);
    }

    function stop() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return { start, stop };
}

// --- Current location ---


function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

export async function currentLocation() {
    try {
        const cityArr = JSON.parse(localStorage.getItem('storeCity')) || [];

        if (cityArr.length === 0) {
            const position = await getPosition(); // ✅ now catchable

            const lat = position.coords?.latitude;
            const lon = position.coords?.longitude;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            if (!response.ok) {
                throw new WeatherError("Failed to fetch location", response.status);
            }

            const data = await response.json();

            const city =
                data.address?.city ??
                data.address?.town ??
                data.address?.village ??
                data.address?.municipality ??
                'Unknown location';

            getGeocode(city);

        } else {
            await refreshAll();
        }

    } catch (error) {
        let weatherError;

        if (error instanceof TypeError) {
            weatherError = new WeatherError("Network error", 0);
        }
        else if (error instanceof WeatherError) {
            weatherError = error;
        }
        else {
            weatherError = new WeatherError("Unknown error", 500);
        }

        errorCard(weatherError);
    }
}