export const getProductImage = (productName) => {
    if (!productName) return '/images/pulses.jpg'; // fallback
    const name = productName.toLowerCase();

    if (name.includes('wheat') || name.includes('sharbati')) {
        return '/images/wheat.png';
    }
    if (name.includes('rice') || name.includes('basmati')) {
        return '/images/rice.png';
    }
    if (name.includes('tomato')) {
        return '/images/tomato.png';
    }
    if (name.includes('mango')) {
        return '/images/mango.png';
    }
    if (name.includes('grape')) {
        return '/images/grapes.png'; // local highly clear grapes photo
    }
    if (name.includes('apple')) {
        return '/images/apples.png'; // local highly clear kashmiri apples photo
    }
    if (name.includes('pulse') || name.includes('dal') || name.includes('gram')) {
        return '/images/pulses.jpg';
    }
    if (name.includes('groundnut') || name.includes('peanut')) {
        return '/images/groundnut.jpg';
    }
    if (name.includes('onion')) {
        return 'https://images.unsplash.com/photo-1618512496248-a07ce8276f57?auto=format&fit=crop&q=80&w=800'; // onions
    }
    if (name.includes('potato')) {
        return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800'; // potatoes
    }
    if (name.includes('cotton')) {
        return 'https://images.unsplash.com/photo-1502099955403-12a832ecbf53?auto=format&fit=crop&q=80&w=800'; // cotton
    }
    if (name.includes('soyabean') || name.includes('soybean')) {
        return 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=800'; // soybeans
    }
    if (name.includes('spice') || name.includes('chilli') || name.includes('turmeric')) {
        return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'; // spices
    }

    // Generic fallback for fruits
    if (name.includes('fruit') || name.includes('banana')) {
        return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800';
    }

    // Generic farmer field
    return 'https://images.unsplash.com/photo-1628102491629-77858c704f58?auto=format&fit=crop&q=80&w=800';
};
