const prisma = require('../config/db');

exports.getWeather = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Verify farmer identity and fetch profile location
        const profile = await prisma.farmerProfile.findUnique({
            where: { userId }
        });

        if (!profile || !profile.farmLocation) {
            return res.status(400).json({ message: "Farm location is missing in profile." });
        }

        const locationString = profile.farmLocation;

        // Secure Backend Request - Weather API endpoints kept purely on backend
        // Step 1: Geocoding via Open-Meteo (requires no authentication but acts as our backend integration)
        let lat, lon;
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationString)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (geoData.results && geoData.results.length > 0) {
                lat = geoData.results[0].latitude;
                lon = geoData.results[0].longitude;
            } else {
                return res.status(404).json({ message: "Could not geolocate the provided farm location." });
            }
        } catch (e) {
            console.error("Geocoding failed:", e);
            return res.status(500).json({ message: "Internal server error fetching generic geolocation." });
        }

        // Step 2: Fetch current & forecast weather data passing backend configured variables implicitly if needed
        let weatherResult = { current: null, forecast: [] };
        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
            const wxData = await weatherRes.json();

            // Format weather codes to readable strings and maps for the UI
            const wxCodeMap = {
                0: "Clear",
                1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                45: "Fog", 48: "Depositing Rime Fog",
                51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
                61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
                80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
                95: "Thunderstorm"
            };

            const getDesc = (code) => wxCodeMap[code] || "Variable";

            weatherResult.current = {
                temperature: Math.round(wxData.current.temperature_2m) + "°C",
                description: getDesc(wxData.current.weather_code)
            };

            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            for (let i = 0; i < 5; i++) {
                const date = new Date(wxData.daily.time[i]);
                const dayName = i === 0 ? "Today" : days[date.getDay()];

                weatherResult.forecast.push({
                    day: dayName,
                    temperature: Math.round((wxData.daily.temperature_2m_max[i] + wxData.daily.temperature_2m_min[i]) / 2) + "°C",
                    description: getDesc(wxData.daily.weather_code[i])
                });
            }

        } catch (e) {
            console.error("Weather API failed:", e);
            return res.status(500).json({ message: "Internal server error connecting to upstream weather API." });
        }

        res.json({
            success: true,
            location: locationString,
            data: weatherResult
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
