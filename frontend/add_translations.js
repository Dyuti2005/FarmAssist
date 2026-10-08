import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');
const transFile = path.join(srcDir, 'constants', 'translations.js');

let content = fs.readFileSync(transFile, 'utf8');

const getKeys = (content, langBlockStr) => {
        const regex = new RegExp(`^\\s*${langBlockStr}:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'm');
        const match = content.match(regex);
        if (!match) return new Set();
        const keys = new Set();
        const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
        let m;
        while ((m = keyRegex.exec(match[0])) !== null) {
                keys.add(m[1]);
        }
        return keys;
};

const enKeys = getKeys(content, 'en');
const knKeys = getKeys(content, 'kn');
const hiKeys = getKeys(content, 'hi');

const usedKeys = new Set();
const defaultVals = {};

const walkSync = (dir, callback) => {
        fs.readdirSync(dir).forEach(file => {
                if (file === 'node_modules' || file.startsWith('.')) return;
                const filepath = path.join(dir, file);
                const stats = fs.statSync(filepath);
                if (stats.isDirectory()) {
                        walkSync(filepath, callback);
                } else if (stats.isFile() && (filepath.endsWith('.jsx') || filepath.endsWith('.js'))) {
                        callback(filepath);
                }
        });
};

walkSync(srcDir, (filepath) => {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        // regex: t('key') || 'Fallback'  OR t(`key_${something}`)
        // We only extract literals for translation addition.
        const tRegex = /t\(['"]([a-zA-Z0-9_]+)['"]\)(?:\s*\|\|\s*['"](.*?)['"])?/g;
        let m;
        while ((m = tRegex.exec(fileContent)) !== null) {
                const key = m[1];
                const def = m[2];
                usedKeys.add(key);
                if (def) defaultVals[key] = def;
        }
});

const generateAdditions = (existingKeys) => {
        const lines = [];
        usedKeys.forEach(k => {
                if (!existingKeys.has(k)) {
                        // we use the fallback string for all missing ones for simplicity (user can correct later or use auto translation if they had one)
                        // wait, we should at least provide a placeholder if def is not found
                        const val = defaultVals[k] || k;

                        // replace double quotes inside the string 
                        const safeVal = val.replace(/"/g, '\\"');
                        lines.push(`        ${k}: "${safeVal}"`);
                }
        });
        return lines;
};

for (const lang of ['en', 'kn', 'hi']) {
        let existingKeys = (lang === 'en') ? enKeys : (lang === 'kn') ? knKeys : hiKeys;
        const lines = generateAdditions(existingKeys);
        if (lines.length > 0) {
                // finding the end of the block
                const regex = new RegExp(`^(\\s*)${lang}:\\s*\\{[\\s\\S]*?(\\n\\s*\\}(,?))`, 'm');
                content = content.replace(regex, (match, prefix, suffix, comma) => {
                        const insert = ",\n" + lines.join(",\n");
                        return match.replace(suffix, insert + suffix);
                });
        }
}

fs.writeFileSync(transFile, content);
console.log("Translations auto-synced successfully!");
