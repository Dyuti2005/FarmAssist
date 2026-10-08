const prisma = require('../config/db');
const { generateInsights } = require('../services/farmIntelligenceEngine');

exports.getInsights = async (req, res) => {
    try {
        const { cropId } = req.params;
        const userId = req.user.userId;

        // Verify crop and ownership securely
        const crop = await prisma.crop.findUnique({
            where: { id: cropId }
        });

        if (!crop) return res.status(404).json({ message: "Crop not found" });
        if (crop.farmerId !== userId) return res.status(403).json({ message: "Unauthorized access" });

        // Get Digital Twin profile
        const twin = await prisma.digitalTwinProfile.findUnique({
            where: { cropId },
            include: { activities: { orderBy: { date: 'desc' }, take: 5 } }
        });

        if (!twin) {
            return res.json({ success: true, insights: [{ type: 'info', message: 'Insufficient twin data to generate specific farm intelligence insights.' }] });
        }

        // Get farmer profile for location
        const profile = await prisma.farmerProfile.findUnique({
            where: { userId }
        });

        // Pull Weather silently via internal logic (to avoid loopback networking complexity)
        let weatherData = null;
        if (profile && profile.farmLocation) {
            try {
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(profile.farmLocation)}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();
                if (geoData.results && geoData.results.length > 0) {
                    const lat = geoData.results[0].latitude;
                    const lon = geoData.results[0].longitude;

                    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
                    const wxData = await wRes.json();

                    const wxCodeMap = {
                        0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                        45: "Fog", 48: "Depositing Rime Fog", 51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
                        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain", 80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers", 95: "Thunderstorm"
                    };
                    const getDesc = (code) => wxCodeMap[code] || "Variable";

                    weatherData = {
                        current: { description: getDesc(wxData.current.weather_code) },
                        forecast: []
                    };

                    for (let i = 0; i < 5; i++) {
                        weatherData.forecast.push({ description: getDesc(wxData.daily.weather_code[i]) });
                    }
                }
            } catch (e) {
                console.error("Internal weather fetch for intelligence failed:", e);
                // Proceed without weather data
            }
        }

        // Generate deterministic insights
        const insights = generateInsights(twin, weatherData, crop);

        res.json({ success: true, insights });
    } catch (error) {
        console.error("Intelligence engine error:", error);
        res.status(500).json({ message: "Internal server error generating insights." });
    }
};
