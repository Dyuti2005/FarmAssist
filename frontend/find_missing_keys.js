import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const transFile = path.join(srcDir, 'constants', 'translations.js');

const transContent = fs.readFileSync(transFile, 'utf8');

const getKeys = (content, langBlockStr) => {
    const regex = new RegExp(`${langBlockStr}:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'm');
    const match = content.match(regex);
    if (!match) return new Set();
    const block = match[0];
    const keys = new Set();
    const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
    let m;
    while ((m = keyRegex.exec(block)) !== null) {
        keys.add(m[1]);
    }
    return keys;
};

const enKeys = getKeys(transContent, 'en');
const knKeys = getKeys(transContent, 'kn');
const hiKeys = getKeys(transContent, 'hi');

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
    const content = fs.readFileSync(filepath, 'utf8');
    const tRegex = /t\(['"]([a-zA-Z0-9_]+)['"]\)(?:\s*\|\|\s*['"](.*?)['"])?/g;
    let m;
    while ((m = tRegex.exec(content)) !== null) {
        const key = m[1];
        const def = m[2];
        usedKeys.add(key);
        if (def) defaultVals[key] = def;
    }
});

const missingEn = [];
const missingKn = [];
const missingHi = [];

usedKeys.forEach(k => {
    if (!enKeys.has(k)) missingEn.push({ key: k, def: defaultVals[k] || '' });
    if (!knKeys.has(k)) missingKn.push({ key: k, def: defaultVals[k] || '' });
    if (!hiKeys.has(k)) missingHi.push({ key: k, def: defaultVals[k] || '' });
});

console.log("Missing EN:", missingEn.length);
if (missingEn.length > 0) missingEn.forEach(k => console.log(`EN: ${k.key}`));
console.log("Missing KN:", missingKn.length);
if (missingKn.length > 0) missingKn.forEach(k => console.log(`KN: ${k.key}`));
console.log("Missing HI:", missingHi.length);
if (missingHi.length > 0) missingHi.forEach(k => console.log(`HI: ${k.key}`));
