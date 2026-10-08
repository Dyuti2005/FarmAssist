const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Marketplace listings
exports.getMarketplace = async (req, res) => {
    try {
        const { search, category } = req.query;

        // Ensure the user is a BUYER
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user || user.role !== 'BUYER') {
            return res.status(403).json({ success: false, message: "Unauthorized access. Only buyers can view marketplace." });
        }

        const filters = {
            status: "AVAILABLE" // Only return available items
        };

        if (search) {
            filters.productName = { contains: search, mode: 'insensitive' };
        }

        // You could add a category column onto Product, but for now we search productName/category dynamically if desired
        // If category is provided and not 'All', we can do a naive name search since category isn't in DB yet.
        if (category && category !== 'All') {
            const catMap = {
                'Grains': ['wheat', 'rice', 'maize', 'corn', 'grain'],
                'Pulses': ['chickpea', 'dal', 'pulse', 'lentil'],
                'Spices': ['mustard', 'chili', 'cardamom', 'spice'],
                'Oilseeds': ['soybean', 'sunflower', 'oil'],
                'Fruits & Veg': ['apple', 'mango', 'tomato', 'onion', 'potato'],
                'Fibers': ['cotton', 'jute']
            };

            const keywords = catMap[category] || [];
            if (keywords.length > 0) {
                // If there's a search term, we combine them. If not, just filter by category keywords
                const categoryConditions = keywords.map(kw => ({ productName: { contains: kw, mode: 'insensitive' } }));
                if (filters.productName) {
                    filters.AND = [
                        { productName: filters.productName },
                        { OR: categoryConditions }
                    ];
                    delete filters.productName;
                } else {
                    filters.OR = categoryConditions;
                }
            }
        }

        // Fetch products, hiding sensitive farmer data. Just include basic farmer profile info needed for UI.
        const products = await prisma.product.findMany({
            where: filters,
            include: {
                farmer: {
                    select: {
                        name: true,
                        farmerProfile: {
                            select: {
                                farmLocation: true,
                            }
                        }
                    }
                },
                crop: {
                    select: {
                        cropName: true,
                        variety: true,
                        actualHarvestDate: true,
                        expectedHarvestDate: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to front-end expected format
        const formatted = products.map(p => ({
            id: p.id,
            title: p.productName,
            category: 'Category', // We don't have this field in DB yet, inferred on frontend or updated later
            price: p.price ? `₹${p.price}/${p.unit}` : 'Contact for price',
            qty: `${p.quantity} ${p.unit}`,
            loc: p.farmer?.farmerProfile?.farmLocation || 'Unknown Location',
            farmer: p.farmer?.name || 'Verified Farmer',
            grade: p.crop?.variety || 'Standard',
            harvestDate: p.crop?.actualHarvestDate ? new Date(p.crop.actualHarvestDate).toLocaleDateString() : (p.crop?.expectedHarvestDate ? new Date(p.crop.expectedHarvestDate).toLocaleDateString() : 'N/A'),
            verified: true, // Mock verified logic based on blockchain could be done later
            img: '/images/pulses.jpg' // Placeholder image
        }));

        res.json({ success: true, products: formatted });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Failed to fetch marketplace data" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

        if (!user || user.role !== 'BUYER') {
            return res.status(403).json({ success: false, message: "Unauthorized access. Only buyers can view marketplace details." });
        }

        const p = await prisma.product.findFirst({
            where: { id, status: "AVAILABLE" },
            include: {
                farmer: {
                    select: {
                        name: true,
                        farmerProfile: {
                            select: {
                                farmLocation: true,
                                farmSize: true
                            }
                        }
                    }
                },
                crop: {
                    select: {
                        cropName: true,
                        variety: true,
                        actualHarvestDate: true,
                        expectedHarvestDate: true
                    }
                }
            }
        });

        if (!p) {
            return res.status(404).json({ success: false, message: "Product not found or unavailable." });
        }

        const formatted = {
            id: p.id,
            title: p.productName,
            category: 'Category',
            price: p.price,
            unit: p.unit,
            quantity: p.quantity,
            loc: p.farmer?.farmerProfile?.farmLocation || 'Unknown Location',
            farmSize: p.farmer?.farmerProfile?.farmSize || 'N/A',
            farmer: p.farmer?.name || 'Verified Farmer',
            variety: p.crop?.variety || 'Standard',
            harvestDate: p.crop?.actualHarvestDate ? new Date(p.crop.actualHarvestDate).toLocaleDateString() : (p.crop?.expectedHarvestDate ? new Date(p.crop.expectedHarvestDate).toLocaleDateString() : 'N/A'),
            img: '/images/pulses.jpg',
            description: `Quality ${p.productName} directly from ${p.farmer?.farmerProfile?.farmLocation || 'our network farms'}. This produce aligns with standard marketplace grade.`
        };

        res.json({ success: true, product: formatted });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Failed to fetch product details" });
    }
};

