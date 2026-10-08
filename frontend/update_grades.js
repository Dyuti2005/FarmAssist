import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, 'src', 'constants', 'translations.js');
let content = fs.readFileSync(p, 'utf8');

const tUpdates = {
    'grade_standard': {
        en: "Standard",
        kn: "ಸಾಮಾನ್ಯ",
        hi: "सामान्य"
    },
    'grade_premium': {
        en: "Premium",
        kn: "ಪ್ರೀಮಿಯಂ",
        hi: "प्रीमियम"
    }
};

for (const lang of ['en', 'kn', 'hi']) {
    for (const [key, trans] of Object.entries(tUpdates)) {
        const val = trans[lang];
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
console.log("Grade translations added!");
