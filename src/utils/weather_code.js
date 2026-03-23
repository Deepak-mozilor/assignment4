export function weatherCodeToEmoji(code) {
    const weatherMap = {
        0: { emoji: "☀️", text: "Clear sky" },
        1: { emoji: "🌤️", text: "Mainly clear" },
        2: { emoji: "⛅", text: "Partly cloudy" },
        3: { emoji: "☁️", text: "Overcast" },

        45: { emoji: "🌫️", text: "Fog" },
        48: { emoji: "🌫️", text: "Rime fog" },

        51: { emoji: "🌦️", text: "Light drizzle" },
        53: { emoji: "🌦️", text: "Moderate drizzle" },
        55: { emoji: "🌧️", text: "Heavy drizzle" },

        56: { emoji: "🌧️", text: "Freezing drizzle" },
        57: { emoji: "🌧️", text: "Heavy freezing drizzle" },

        61: { emoji: "🌦️", text: "Light rain" },
        63: { emoji: "🌧️", text: "Moderate rain" },
        65: { emoji: "🌧️", text: "Heavy rain" },

        66: { emoji: "🌧️", text: "Freezing rain" },
        67: { emoji: "🌧️", text: "Heavy freezing rain" },

        71: { emoji: "🌨️", text: "Light snow" },
        73: { emoji: "❄️", text: "Moderate snow" },
        75: { emoji: "❄️", text: "Heavy snow" },

        77: { emoji: "🌨️", text: "Snow grains" },

        80: { emoji: "🌦️", text: "Rain showers" },
        81: { emoji: "🌧️", text: "Moderate showers" },
        82: { emoji: "⛈️", text: "Heavy showers" },

        85: { emoji: "🌨️", text: "Snow showers" },
        86: { emoji: "❄️", text: "Heavy snow showers" },

        95: { emoji: "⛈️", text: "Thunderstorm" },
        96: { emoji: "⛈️", text: "Storm with hail" },
        99: { emoji: "⛈️", text: "Heavy storm with hail" }
    };

    return weatherMap[code] || { emoji: "❓", text: "Unknown weather" };
}