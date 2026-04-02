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
            weatherCode: daily.weather_code?.[i] ?? 0,
        };
    });
}

// --- Core data fetching ---

export async function getData(lat, long, city) {
    try {
        const skeleton = document.querySelector('.skeleton');

        // Fetch current weather AND 5-day daily forecast in parallel
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`http://127.0.0.1:8000/addtodb`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    city: city,
                    latitude: lat,
                    longitude: long
                })
            }),
            fetch(`http://127.0.0.1:8000/forecast?lat=${lat}&long=${long}`,{
                    method: 'GET',
                    credentials: 'include'
                }
            )
        ]);

        if (!currentRes.ok) {
            throw new WeatherError(`Weather fetch failed for ${city}`, currentRes.status);
        }

        if (!forecastRes.ok) {
            throw new WeatherError(`Forecast fetch failed for ${city}`, forecastRes.status);
        }

        const data = await currentRes.json();
        console.log(data);
        const forecastData = await forecastRes.json();

        const tempRaw = data.weather?.temperature_2m ?? 0;
        const humidity = data.weather?.relative_humidity_2m ?? 0;
        const feelsLikeRaw = data.weather?.apparent_temperature ?? 0;
        const windSpeed = data.weather?.wind_speed_10m ?? 0; 
        const weatherCode = data.weather?.weather_code ?? 0;

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

        const forecastDays = forecastData.forecast ? parseForecast(forecastData.forecast, unitBtn) : [];

        newCard(city, temp, humidity, feelsLike, windSpeed, weatherCode, unit, forecastDays);
        removeBtn();

        
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

        const existingCities = Array.from(document.querySelectorAll('.city-card h2'))
            .map(h2 => h2.textContent.toLowerCase());

        if (existingCities.includes(normalizedCity)) {
            alert("City already present on dashboard!");
            return;
        }

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
    try {
        const response = await fetch('http://127.0.0.1:8000/my-cities', {
            method: 'GET',
            credentials: 'include' 
        });

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED"); 
        }

        if (!response.ok) {
            throw new Error("Failed to load cities from database");
        }

        const dbData = await response.json();
        const cityArr = dbData.cities || [];

        console.log(dbData);
        console.log(cityArr);

        document.querySelector('.dashboard').innerHTML = '';

        if (cityArr.length === 0) {
            console.log("Database is empty! Fetching user's current location...");
            return; 
        }

        const results = await Promise.allSettled(
            cityArr.map(item => getData(item.latitude, item.longitude, item.city))
        );

        results.forEach((result, i) => {
            if (result.status === 'rejected') {
                const city = cityArr[i]?.city ?? 'unknown';
                console.warn(`Failed to refresh "${city}":`, result.reason);
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard from DB:", error);

        if (error.message === "UNAUTHORIZED") {
            alert("Your session has expired or you are not logged in. Please log in again.");
            window.location.href = "login/login.html"; 
        } else {
            alert("Could not load your dashboard. Please try again later.");
        }
    }
}



export function createAutoRefresh(intervalMs = 600000) {
    console.log('refresh');
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
        // 1. First, tell the backend to load any saved cities
        await refreshAll(); 

        // 2. Check if the dashboard is still empty after the database load
        const dashboard = document.querySelector('.dashboard');
        
        if (dashboard.children.length === 0) {
            // The database had nothing, so let's get their GPS!
            const position = await getPosition();
            const lat = position.coords?.latitude;
            const lon = position.coords?.longitude;

            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);

            if (!response.ok) throw new WeatherError("Failed to fetch location", response.status);

            const data = await response.json();
            const city = data.address?.city ?? data.address?.town ?? data.address?.village ?? 'Unknown location';

            getGeocode(city);
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

export async function report(){
    window.location.href = '/report/report.html';
}
