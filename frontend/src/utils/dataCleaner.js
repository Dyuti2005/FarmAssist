const demoLocations = ['Nashik, MH', 'Pune, MH', 'Vidisha, MP', 'Karnal, HR', 'Indore, MP', 'Belagavi, KA'];
const demoFarmers = ['Ramesh Singh', 'Sundaram', 'Rajesh', 'Anil Kumar', 'Sneha Patil', 'Vikram Desai'];

export const cleanString = (str) => {
    if (typeof str !== 'string') return str;
    let cleaned = str.replace(/^[0-9]+[a-zA-Z]+\s+/g, '');
    cleaned = cleaned.replace(/Phase\s+[0-9a-zA-Z]+\s+/gi, '');
    cleaned = cleaned.replace(/Dynamic\s+/gi, '');
    cleaned = cleaned.trim();

    if (cleaned.toLowerCase() === 'farmer') {
        return 'Ramesh Singh';
    }

    return cleaned;
};

export const sanitizeProduct = (product, index = 0) => {
    if (!product) return product;

    let cleanTitle = cleanString(product.title || product.productName || '');

    // Normalize generic products for better demo variety
    const tLower = cleanTitle.toLowerCase();
    if (tLower.includes('wheat')) cleanTitle = 'Premium Wheat';
    else if (tLower.includes('tomato')) cleanTitle = 'Organic Tomato';
    else if (tLower.includes('mango')) cleanTitle = 'Alphonso Mango';
    else if (tLower.includes('grape')) cleanTitle = 'Export Grade Grapes';
    else if (tLower.includes('apple')) cleanTitle = 'Kashmiri Apples';
    else if (tLower.includes('rice')) cleanTitle = 'Basmati Rice';
    else if (tLower.includes('cotton')) cleanTitle = 'Raw Cotton';
    else if (tLower.includes('onion')) cleanTitle = 'Red Onions';
    else if (tLower.includes('pulse') || tLower.includes('dal')) cleanTitle = 'Organic Pulses (Dal)';
    else if (!cleanTitle) cleanTitle = 'Standard Produce';

    let loc = product.loc;
    if (!loc || loc.includes('Unknown')) {
        loc = demoLocations[index % demoLocations.length];
    }

    let fName = cleanString(product.farmer);
    if (!fName || fName.toLowerCase().includes('farmer')) {
        fName = demoFarmers[index % demoFarmers.length];
    }

    return {
        ...product,
        title: cleanTitle,
        productName: cleanTitle, // for cart/orders compatibility
        loc: loc,
        farmer: fName
    };
};

export const sanitizeProductsList = (products) => {
    if (!Array.isArray(products)) return [];

    const seenTitles = new Set();
    const sanitized = [];

    products.forEach((p, index) => {
        const cleanProduct = sanitizeProduct(p, index);

        // Remove duplicates based on title for the marketplace list
        if (!seenTitles.has(cleanProduct.title)) {
            seenTitles.add(cleanProduct.title);
            sanitized.push(cleanProduct);
        }
    });

    return sanitized;
};
