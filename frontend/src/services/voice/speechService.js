export const getVoices = () => {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        };
    });
};

export const speakText = async (text, langCode, callback) => {
    if (!('speechSynthesis' in window)) {
        if (callback) callback();
        return;
    }

    window.speechSynthesis.cancel();

    // Fallback safeguard to quickly trigger callback if voices fail to load
    let hasReturned = false;
    const safeCallback = () => {
        if (!hasReturned) {
            hasReturned = true;
            if (callback) callback();
        }
    };

    try {
        const voices = await getVoices();
        const utterance = new SpeechSynthesisUtterance(text);

        let targetLang = langCode; // 'en-IN', 'kn-IN', 'hi-IN'
        let baseLang = langCode.split('-')[0]; // 'en', 'kn', 'hi'

        let voice = voices.find(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang) ||
            voices.find(v => v.lang.startsWith(baseLang) || v.name.toLowerCase().includes(baseLang)) ||
            voices.find(v => v.default) ||
            voices[0];

        if (voice) {
            utterance.voice = voice;
        }
        utterance.lang = targetLang;
        utterance.onend = safeCallback;
        utterance.onerror = safeCallback;

        window.speechSynthesis.speak(utterance);
    } catch (e) {
        safeCallback();
    }
};

export const normalizeToDigits = (str) => {
    if (!str) return "";
    const knMap = { '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9' };
    const hiMap = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
    let result = str.split('').map(char => knMap[char] || hiMap[char] || char).join('');
    // Remove space words that might be interpreted wrong, extract digits directly
    result = result.replace(/\D/g, '');
    return result;
};
