const prisma = require('../config/db');
const { askTwinAI } = require('../services/aiService');
const { generateInsights } = require('../services/farmIntelligenceEngine');

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ message: "Invalid or empty message provided." });
        }

        // Dynamically build the context for real farmer mapping
        // 1. Get farmer profile
        const profile = await prisma.farmerProfile.findUnique({ where: { userId } });
        if (!profile) return res.status(403).json({ message: "Farmer context not found." });

        // 2. Get active crop and twin
        const crop = await prisma.crop.findFirst({ where: { farmerId: userId }, orderBy: { createdAt: 'desc' } });
        let twinData = null, insights = [];

        if (crop) {
            twinData = await prisma.digitalTwinProfile.findUnique({
                where: { cropId: crop.id },
                include: { activities: { orderBy: { date: 'desc' }, take: 3 } }
            });

            // 3. Reconstruct Weather Context natively without hitting endpoint loopback
            let weatherData = null;
            if (profile.farmLocation) {
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
                            current: { temperature: Math.round(wxData.current.temperature_2m) + "°C", description: getDesc(wxData.current.weather_code) },
                            forecast: []
                        };
                    }
                } catch (e) { console.error("Weather unreachable in AI controller"); }
            }

            if (twinData) {
                insights = generateInsights(twinData, weatherData, crop).filter(i => i.type !== 'info');
            }

            const contextData = {
                location: profile.farmLocation,
                farmSize: profile.farmSize,
                cropName: crop.cropName,
                weather: weatherData,
                soilPh: twinData?.soilPh || null,
                soilN: twinData?.soilN || null,
                soilP: twinData?.soilP || null,
                soilK: twinData?.soilK || null,
                insights: insights
            };

            console.log("\n[VERIFICATION] AI Context Assembled Backend-Side:");
            console.log(JSON.stringify(contextData, null, 2));

            const aiResponse = await askTwinAI(message, contextData);

            res.json({
                success: true,
                reply: aiResponse,
                contextUsed: {
                    crop: crop.cropName,
                    location: profile.farmLocation,
                    insightsProvided: insights.length > 0
                }
            });
        } else {
            // No crops - minimal context
            const response = await askTwinAI(message, { location: profile.farmLocation });
            res.json({ success: true, reply: response });
        }
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate AI response." });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId: req.user.userId },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, conversations });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch conversations." });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const { title, language } = req.body;

        // Language Normalization/Validation Utility
        const supported = ['en', 'kn', 'hi'];
        const safeLang = supported.includes(language) ? language : 'en';

        const conv = await prisma.conversation.create({
            data: { userId: req.user.userId, title: title || "New Conversation", language: safeLang }
        });
        res.json({ success: true, conversation: conv });
    } catch (e) {
        res.status(500).json({ message: "Failed to create conversation." });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const conv = await prisma.conversation.findFirst({ where: { id, userId: req.user.userId } });
        if (!conv) return res.status(404).json({ message: "Conversation not found." });

        const messages = await prisma.chatMessage.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' }
        });
        res.json({ success: true, messages });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch messages." });
    }
};

exports.updateConversationLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { language } = req.body;

        // Language Normalization/Validation Utility
        const supported = ['en', 'kn', 'hi'];
        if (!supported.includes(language)) {
            return res.status(400).json({ message: "Unsupported language value provided." });
        }

        const conv = await prisma.conversation.findFirst({ where: { id, userId: req.user.userId } });
        if (!conv) return res.status(404).json({ message: "Conversation not found." });

        await prisma.conversation.update({ where: { id }, data: { language } });
        res.json({ success: true, message: "Language updated successfully." });
    } catch (e) {
        res.status(500).json({ message: "Failed to update conversation language." });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const conv = await prisma.conversation.findFirst({ where: { id, userId: req.user.userId } });
        if (!conv) return res.status(404).json({ message: "Conversation not found." });

        await prisma.conversation.delete({ where: { id } });
        res.json({ success: true, message: "Deleted successfully." });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete conversation." });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user.userId;

        if (!message || message.trim() === '') return res.status(400).json({ message: "Empty message." });

        const conv = await prisma.conversation.findFirst({ where: { id, userId } });
        if (!conv) return res.status(404).json({ message: "Conversation not found." });

        // Save User Message
        await prisma.chatMessage.create({
            data: { conversationId: id, sender: 'USER', content: message }
        });
        await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

        // Gemini AI Execution Process
        let aiResponse = "I am currently disconnected from my neural network. Please check API configurations.";

        if (process.env.GEMINI_API_KEY) {
            try {
                // Fetch previous conversation history for the AI Service context
                const rawPrevMessages = await prisma.chatMessage.findMany({
                    where: { conversationId: id },
                    orderBy: { createdAt: 'asc' }
                });
                // Exclude the currently just-inserted user message from the historical block to avoid duplication
                const previousMessages = rawPrevMessages.slice(0, -1);

                // Simplified context fetch for this phase
                const profile = await prisma.farmerProfile.findUnique({ where: { userId } });
                const contextData = { location: profile?.farmLocation || "Unknown", language: conv.language };

                aiResponse = await askTwinAI(message, contextData, previousMessages);
            } catch (e) {
                console.error("AI Generation Error:", e);
                aiResponse = "I encountered an internal error reaching the farm assistant network.";
            }
        }

        // Save AI Message
        const savedAiMsg = await prisma.chatMessage.create({
            data: { conversationId: id, sender: 'ASSISTANT', content: aiResponse }
        });

        res.json({ success: true, reply: aiResponse, messageObj: savedAiMsg });
    } catch (e) {
        res.status(500).json({ message: "Failed to process message." });
    }
};

