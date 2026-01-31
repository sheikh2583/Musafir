const fs = require('fs');
const path = require('path');

const translationDir = 'd:/Musafir/quran/translation/en';
const outputFile = 'd:/Musafir/mobile-app/src/data/quran_translation.json';

const result = [];

// Sort 1-114
for (let i = 1; i <= 114; i++) {
    const file = path.join(translationDir, `en_translation_${i}.json`);
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        result.push(json); // Pushing the whole object { name, index, verse: {...} }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
        result.push({ index: i.toString().padStart(3, '0'), verse: {} }); // Placeholder
    }
}

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
console.log(`Successfully merged ${result.length} surahs into ${outputFile}`);
