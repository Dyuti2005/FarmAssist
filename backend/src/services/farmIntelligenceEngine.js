function generateInsights(twinData, weatherData, cropData) {
    const insights = [];

    // Rule 1: Weather Advisory (Rain)
    if (weatherData && weatherData.current) {
        const desc = weatherData.current.description.toLowerCase();
        if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('thunderstorm')) {
            insights.push({
                type: 'weather',
                message: `Current weather is ${weatherData.current.description}. Delay applying any fertilizers or pesticides as they may wash away.`
            });
        }
    }

    // Rule 2: Soil pH Condition
    if (twinData.soilPh !== null && twinData.soilPh !== undefined) {
        if (twinData.soilPh < 6.0) {
            insights.push({
                type: 'soil',
                message: `Your soil pH is acidic (${twinData.soilPh}). Consider applying agricultural lime to raise the pH for better nutrient availability.`
            });
        } else if (twinData.soilPh > 7.5) {
            insights.push({
                type: 'soil',
                message: `Your soil pH is alkaline (${twinData.soilPh}). Consider adding organic matter or elemental sulfur to lower it slightly.`
            });
        } else {
            insights.push({
                type: 'soil',
                message: `Soil pH is excellent (${twinData.soilPh}). No corrective action needed for acidity/alkalinity.`
            });
        }
    }

    // Rule 3: Nutrient Condition (NPK)
    if (twinData.soilN !== null && twinData.soilP !== null && twinData.soilK !== null) {
        // Simple deterministic rule for NPK balance concept
        if (twinData.soilN < 10) {
            insights.push({
                type: 'nutrient',
                message: `Nitrogen (N) level is somewhat low (${twinData.soilN}). Focus on nitrogen-rich fertilizers to support leafy growth.`
            });
        }
        if (twinData.soilP < 20) {
            insights.push({
                type: 'nutrient',
                message: `Phosphorous (P) is slightly low (${twinData.soilP}). Ensure adequate P for healthy root development.`
            });
        }
    }

    // Rule 4: Weather-based Irrigation Advisory
    if (weatherData && weatherData.forecast && weatherData.forecast.length >= 3) {
        const upcomingRain = weatherData.forecast.slice(0, 3).some(w => w.description.toLowerCase().includes('rain') || w.description.toLowerCase().includes('drizzle') || w.description.toLowerCase().includes('shower') || w.description.toLowerCase().includes('thunderstorm'));
        if (upcomingRain) {
            insights.push({
                type: 'irrigation',
                message: `Rain is expected in the next 3 days. You may hold off on manual irrigation to conserve water and prevent waterlogging.`
            });
        } else {
            insights.push({
                type: 'irrigation',
                message: `No rain expected over the next 3 days. Ensure you stick to your scheduled irrigation cycles to prevent dry soil conditions.`
            });
        }
    }

    // Rule 5: Recent Activity Observations
    let hasRecentActivity = false;
    if (twinData.activities && twinData.activities.length > 0) {
        const lastActivity = twinData.activities[0];
        const daysSince = Math.floor((new Date() - new Date(lastActivity.date)) / (1000 * 60 * 60 * 24));
        if (daysSince > 30) {
            insights.push({
                type: 'activity',
                message: `No farm activity logged in over 30 days. Regular monitoring is key to maintaining farm health.`
            });
        } else {
            // General observation based on last activity
            if (lastActivity.activityType.toLowerCase().includes('fertilizer')) {
                insights.push({
                    type: 'activity',
                    message: `Fertilizer recently applied on ${new Date(lastActivity.date).toLocaleDateString()}. Ensure proper watering without over-saturating the soil.`
                });
            }
        }
        hasRecentActivity = true;
    }

    // Fallback if data is truly insufficient
    if (insights.length === 0) {
        return [{ type: 'info', message: 'Insufficient data available to generate specific farm intelligence insights at this time.' }];
    }

    return insights;
}

module.exports = { generateInsights };
