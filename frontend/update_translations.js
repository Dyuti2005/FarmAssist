import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, 'src', 'constants', 'translations.js');
let content = fs.readFileSync(p, 'utf8');

const tUpdates = {
    'browse_produce': {
        en: "Browse Produce",
        kn: "ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
        hi: "उपज ब्राउज़ करें"
    },
    'browse_produce_desc': {
        en: "Discover quality agricultural produce direct from farmers.",
        kn: "ರೈತರಿಂದ ನೇರವಾಗಿ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        hi: "किसानों से सीधे गुणवत्ता वाले कृषि उपज खोजें।"
    },
    'search_produce_placeholder': {
        en: "Search for wheat, rice, spices...",
        kn: "ಗೋಧಿ, ಅಕ್ಕಿ, ಸಾಂಬಾರ ಪದಾರ್ಥಗಳಿಗಾಗಿ ಹುಡುಕಿ...",
        hi: "गेहूं, चावल, मसालों के लिए खोजें..."
    },
    'filters': {
        en: "Filters",
        kn: "ಫಿಲ್ಟರ್‌ಗಳು",
        hi: "फ़िल्टर"
    },
    'cat_all': {
        en: "All",
        kn: "ಎಲ್ಲಾ",
        hi: "सभी"
    },
    'cat_grains': {
        en: "Grains",
        kn: "ಧಾನ್ಯಗಳು",
        hi: "अनाज"
    },
    'cat_pulses': {
        en: "Pulses",
        kn: "ದ್ವಿದಳ ಧಾನ್ಯಗಳು",
        hi: "दालें"
    },
    'cat_spices': {
        en: "Spices",
        kn: "ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು",
        hi: "मसाले"
    },
    'cat_oilseeds': {
        en: "Oilseeds",
        kn: "ಎಣ್ಣೆಕಾಳುಗಳು",
        hi: "तिलहन"
    },
    'cat_fruits_veg': {
        en: "Fruits & Veg",
        kn: "ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳು",
        hi: "फल और सब्जियां"
    },
    'loading_marketplace': {
        en: "Loading marketplace...",
        kn: "ಮಾರುಕಟ್ಟೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        hi: "मार्केटप्लेस लोड हो रहा है..."
    },
    'no_marketplace_products': {
        en: "No products found matching your active filters.",
        kn: "ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳಿಲ್ಲ.",
        hi: "आपके फ़िल्टर से खाने वाले कोई उत्पाद नहीं मिले।"
    },
    'grade': {
        en: "Grade",
        kn: "ಗ್ರೇಡ್",
        hi: "ग्रेड"
    },
    'verified_produce': {
        en: "Verified Produce",
        kn: "ಪರಿಶೀಲಿಸಿದ ಉತ್ಪನ್ನ",
        hi: "सत्यापित उपज"
    },
    'available': {
        en: "available",
        kn: "ಲಭ್ಯವಿದೆ",
        hi: "उपलब्ध"
    },
    'harvest': {
        en: "Harvest",
        kn: "ಕೊಯ್ಲು",
        hi: "फसल कटाई"
    },
    'view_details': {
        en: "View Details",
        kn: "ವಿವರಣೆ ನೋಡಿ",
        hi: "विवरण देखें"
    },
    'buy_now': {
        en: "Buy Now",
        kn: "ಈಗಲೇ ಖರೀದಿಸಿ",
        hi: "अभी खरीदें"
    }
};

for (const lang of ['en', 'kn', 'hi']) {
    for (const [key, trans] of Object.entries(tUpdates)) {
        const val = trans[lang];
        // Does the key already exist in this lang block?
        // We will just do a simple replacement if it exists for the language, or append it if it doesn't.
        // It's safer to locate the block first.

        let blockRegex = new RegExp(`^(\\s*)${lang}:\\s*\\{([\\s\\S]*?)(\\n\\s*\\}(,?))`, 'm');
        let match = content.match(blockRegex);
        if (match) {
            let blockContent = match[2];
            let keyRegex = new RegExp(`^(\\s*${key}\\s*:)\\s*".*?"(,?)$`, 'm');
            let keyMatch = blockContent.match(keyRegex);

            if (keyMatch) {
                // replace existing
                let newBlockContent = blockContent.replace(keyRegex, `$1 "${val}"$2`);
                content = content.replace(match[0], match[0].replace(blockContent, newBlockContent));
            } else {
                // append to block
                content = content.replace(match[0], match[0].replace(match[3], `,\n        ${key}: "${val}"${match[3]}`));
            }
        }
    }
}

fs.writeFileSync(p, content);
console.log("Translations exactly updated!");
