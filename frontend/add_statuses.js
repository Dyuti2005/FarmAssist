import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, 'src', 'constants', 'translations.js');
let content = fs.readFileSync(p, 'utf8');

const statusKeys = {
    'status_active': 'Active',
    'status_pending_signature': 'Pending Signature',
    'status_completed': 'Completed'
};

const langs = ['en', 'kn', 'hi'];
for (const lang of langs) {
    const lines = [];
    for (const [k, v] of Object.entries(statusKeys)) {
        if (!content.includes(' ' + k + ': ')) {
            lines.push('        ' + k + ': "' + v + '"');
        }
    }
    if (lines.length > 0) {
        const regex = new RegExp(`^(\\s*)${lang}:\\s*\\{[\\s\\S]*?(\\n\\s*\\}(,?))`, 'm');
        content = content.replace(regex, (match, prefix, suffix) => {
            return match.replace(suffix, ',\n' + lines.join(',\n') + suffix);
        });
    }
}
fs.writeFileSync(p, content);
console.log("Statuses added!");
