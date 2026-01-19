const fs = require('fs');
const path = require('path');

let totalVerses = 0;
const surahVerseCounts = [];

for (let i = 1; i <= 114; i++) {
  const surahFile = path.join(__dirname, '../quran/surah', `surah_${i}.json`);
  const data = JSON.parse(fs.readFileSync(surahFile, 'utf-8'));
  const verses = Object.keys(data.verse).filter(k => k.startsWith('verse_'));
  surahVerseCounts.push({ surah: i, count: verses.length });
  totalVerses += verses.length;
}

console.log('Total verses in Quran files:', totalVerses);
console.log('\nVerse counts by surah:');
surahVerseCounts.forEach(s => {
  console.log(`Surah ${s.surah}: ${s.count} verses`);
});
