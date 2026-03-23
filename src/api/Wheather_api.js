import { new_card } from '../main_content/content.js';
import { remove_btn } from '../utils/remove.js';
import { error_card, WeatherError } from '../errors/error_card.js';
import { to_fahrenheit } from "../utils/unit_converter.js";

// --- Forecast helpers ---

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function parseForecast(daily, unit_btn) {
    const isFahrenheit = unit_btn?.id === 'fahrenheit';

    return daily.time.map((dateStr, i) => {
        let maxTemp = Math.floor(daily.temperature_2m_max?.[i] ?? 0);
        let minTemp = Math.floor(daily.temperature_2m_min?.[i] ?? 0);

        if (isFahrenheit) {
            maxTemp = Math.floor(to_fahrenheit(maxTemp));
            minTemp = Math.floor(to_fahrenheit(minTemp));
        }

        return {
            date: formatDate(dateStr),
            maxTemp,
            minTemp,
            weatherCode: daily.weather_code?.[i] ?? 0,
        };
    });
}

// --- Core data fetching ---

export async function get_data(lat, long, city) {
    try {
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];
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
        const temp_raw = data.current?.temperature_2m ?? 0;
        const humidity = data.current?.relative_humidity_2m ?? 0;
        const feels_like_raw = data.current?.apparent_temperature ?? 0;
        const wind_speed = data.current?.wind_speed_10m ?? 0;
        const weather_code = data.current?.weather_code ?? 0;

        skeleton?.remove();

        const unit_btn = document.querySelector('.unit-btn');
        let unit = '°C';
        let temp = Math.floor(temp_raw);
        let feels_like = Math.floor(feels_like_raw);

        if (unit_btn?.id === 'fahrenheit') {
            unit = '°F';
            temp = Math.floor(to_fahrenheit(temp_raw));
            feels_like = Math.floor(to_fahrenheit(feels_like_raw));
        }

        // Parse 5-day forecast
        const forecastDays = forecastData.daily ? parseForecast(forecastData.daily, unit_btn) : [];

        new_card(city, temp, humidity, feels_like, wind_speed, weather_code, unit, forecastDays);
        remove_btn();

        localStorage.setItem('store_city', JSON.stringify(city_arr));
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

        error_card(weatherError);
    }
}

export async function get_geocode(city) {
    try {
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];
        const normalizedCity = city.split(',')[0].trim().toLowerCase();

        const geocode_response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${normalizedCity}&count=10&language=en&format=json`
        );

        if (!geocode_response.ok) {
            throw new WeatherError(`Geocode fetch failed for "${normalizedCity}"`, geocode_response.status);
        }

        const geocode = await geocode_response.json();

        // Optional chaining on results
        const lat = geocode.results?.[0]?.latitude;
        const long = geocode.results?.[0]?.longitude;

        if (lat == null || long == null) {
            throw new WeatherError(`City "${normalizedCity}" not found`);
        }

        if (city_arr.some(item => item.city === normalizedCity)) {
            alert("City already present");
            return;
        }

        city_arr.push({ latitude: lat, longitude: long, city: normalizedCity });
        localStorage.setItem('store_city', JSON.stringify(city_arr));

        get_data(lat, long, city);
    } catch (error) {
        const weatherError = error instanceof WeatherError
            ? error
            : new WeatherError(error?.message ?? 'Unknown geocode error');
        error_card(weatherError);
    }
}

// --- Promise.allSettled: refresh all cities independently ---

export async function refreshAll() {
    const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];

    if (city_arr.length === 0) return;

    const results = await Promise.allSettled(
        city_arr.map(item => get_data(item.latitude, item.longitude, item.city))
    );

    results.forEach((result, i) => {
        if (result.status === 'rejected') {
            const city = city_arr[i]?.city ?? 'unknown';
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

export async function current_location() {
    try {
        const city_arr = JSON.parse(localStorage.getItem('store_city')) || [];

        if (city_arr.length === 0) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords?.latitude;
                const lon = position.coords?.longitude;

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                );

                if (!response.ok) {
                    throw new WeatherError(`Network Error`);
                }
                const data = await response.json();

                const city =
                    data.address?.city ??
                    data.address?.town ??
                    data.address?.village ??
                    data.address?.municipality ??
                    'Unknown location';

                get_geocode(city);
            });
        } else {
            await refreshAll();
        }
    } catch (error) {
        const weatherError = error instanceof WeatherError
            ? error
            : new WeatherError(error?.message ?? 'Unknown error fetching data');
        error_card(weatherError);
    }
}