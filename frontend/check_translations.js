const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const transFile = path.join(srcDir, 'constants', 'translations.js');

const content = fs.readFileSync(transFile, 'utf8');

// Extract just the en, kn, hi objects
const extractObj = (lang) => {
    const startStr = `${lang}: {`;
    const startIdx = content.indexOf(startStr);
    if (startIdx === -1) return {};

    let braceCount = 0;
    let endIdx = -1;
    let started = false;

    for (let i = startIdx + startStr.length - 1; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            started = true;
        } else if (content[i] === '}') {
            braceCount--;
        }

        if (started && braceCount === 0) {
            endIdx = i + 1;
            break;
        }
    }

    const objStr = content.substring(startIdx + startStr.length - 1, endIdx);

    // Quick regex parsing
    let keys = [];
    const regex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
    let match;
    while ((match = regex.exec(objStr)) !== null) {
        keys.push(match[1]);
    }
    return keys;
}

const enKeys = extractObj('en');
const knKeys = extractObj('kn');
const hiKeys = extractObj('hi');

const allKeysFound = [];

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            const regex = /t\(['"]([^'"]+)['"]\)/g;
            let match;
            while ((match = regex.exec(fileContent)) !== null) {
                if (!allKeysFound.includes(match[1])) {
                    allKeysFound.push(match[1]);
                }
            }
        }
    }
}

scanDir(srcDir);

const missingInKn = allKeysFound.filter(k => !knKeys.includes(k));
const missingInHi = allKeysFound.filter(k => !hiKeys.includes(k));
const missingInEn = allKeysFound.filter(k => !enKeys.includes(k));

console.log("Missing en keys:", missingInEn);
console.log("Missing kn keys:", missingInKn);
console.log("Missing hi keys:", missingInHi);

