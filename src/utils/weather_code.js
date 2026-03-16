export function weatherCodeToEmoji(code){

    const weatherMap = {
        0: "☀️ Clear sky",
        1: "🌤️ Mainly clear",
        2: "⛅ Partly cloudy",
        3: "☁️ Overcast",

        45: "🌫️ Fog",
        48: "🌫️ Depositing rime fog",

        51: "🌦️ Light drizzle",
        53: "🌦️ Moderate drizzle",
        55: "🌧️ Dense drizzle",

        56: "🌧️ Freezing drizzle",
        57: "🌧️ Heavy freezing drizzle",

        61: "🌦️ Slight rain",
        63: "🌧️ Moderate rain",
        65: "🌧️ Heavy rain",

        66: "🌧️ Freezing rain",
        67: "🌧️ Heavy freezing rain",

        71: "🌨️ Slight snow",
        73: "❄️ Moderate snow",
        75: "❄️ Heavy snow",

        77: "🌨️ Snow grains",

        80: "🌦️ Rain showers",
        81: "🌧️ Moderate rain showers",
        82: "⛈️ Violent rain showers",

        85: "🌨️ Snow showers",
        86: "❄️ Heavy snow showers",

        95: "⛈️ Thunderstorm",
        96: "⛈️ Thunderstorm with hail",
        99: "⛈️ Heavy thunderstorm with hail"
    };

    return weatherMap[code] || "❓ Unknown weather";
}