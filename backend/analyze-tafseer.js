const fs = require('fs');
const path = require('path');

// Load tafseer data
const tafseerPath = path.join(__dirname, '../en-tafisr-ibn-kathir.json/en-tafisr-ibn-kathir.json');
const tafseerData = JSON.parse(fs.readFileSync(tafseerPath, 'utf-8'));

// Expected verses per surah
const verseCounts = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

const totalQuranVerses = Object.values(verseCounts).reduce((a, b) => a + b, 0);

console.log('=== TAFSEER ANALYSIS ===\n');
console.log(`Total verses in Quran: ${totalQuranVerses}`);
console.log(`Total tafseer entries: ${Object.keys(tafseerData).length}`);
console.log(`Missing: ${totalQuranVerses - Object.keys(tafseerData).length}\n`);

// Count verses by surah
const surahCounts = {};
Object.keys(tafseerData).forEach(key => {
  const [surah] = key.split(':');
  surahCounts[surah] = (surahCounts[surah] || 0) + 1;
});

console.log(`Number of surahs with tafseer: ${Object.keys(surahCounts).length}\n`);

// Find missing surahs
const missingSurahs = [];
for (let i = 1; i <= 114; i++) {
  if (!surahCounts[i.toString()]) {
    missingSurahs.push(i);
  }
}

if (missingSurahs.length > 0) {
  console.log('COMPLETELY MISSING SURAHS:');
  console.log(missingSurahs.join(', '));
  console.log('');
}

// Find surahs with incomplete tafseer
console.log('SURAHS WITH INCOMPLETE TAFSEER:\n');
const incompleteSurahs = [];

for (let surah = 1; surah <= 114; surah++) {
  const expected = verseCounts[surah];
  const actual = surahCounts[surah.toString()] || 0;
  
  if (actual > 0 && actual < expected) {
    incompleteSurahs.push({
      surah,
      expected,
      actual,
      missing: expected - actual,
      percentage: ((actual / expected) * 100).toFixed(1)
    });
  }
}

if (incompleteSurahs.length > 0) {
  incompleteSurahs.forEach(s => {
    console.log(`Surah ${s.surah}: ${s.actual}/${s.expected} verses (${s.percentage}% complete, missing ${s.missing})`);
  });
} else {
  console.log('All surahs with tafseer are complete!');
}

console.log('\n=== SUMMARY ===');
console.log(`Missing surahs entirely: ${missingSurahs.length}`);
console.log(`Partially covered surahs: ${incompleteSurahs.length}`);
console.log(`Fully covered surahs: ${Object.keys(surahCounts).length - incompleteSurahs.length}`);

// Calculate total coverage
const totalTafseerVerses = Object.values(surahCounts).reduce((a, b) => a + b, 0);
console.log(`\nTotal coverage: ${totalTafseerVerses}/${totalQuranVerses} verses (${((totalTafseerVerses/totalQuranVerses)*100).toFixed(2)}%)`);
