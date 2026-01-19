const fs = require('fs').promises;
const path = require('path');

async function verifyMapping() {
  console.log('=== VERIFYING VERSE-TAFSEER MAPPING ===\n');
  
  // Load tafseer
  const tafseerPath = path.join(__dirname, '../en-tafisr-ibn-kathir.json/en-tafisr-ibn-kathir.json');
  const tafseerData = JSON.parse(await fs.readFile(tafseerPath, 'utf-8'));
  
  console.log(`Tafseer entries: ${Object.keys(tafseerData).length}\n`);
  
  // Check first 10 verses from Surah 1
  console.log('Checking Surah 1 (Al-Fatiha):');
  const quranPath = path.join(__dirname, '../quran');
  const surahFile = path.join(quranPath, 'surah', 'surah_1.json');
  const translationFile = path.join(quranPath, 'translation', 'en', 'en_translation_1.json');
  
  const surahJson = JSON.parse(await fs.readFile(surahFile, 'utf-8'));
  const translationJson = JSON.parse(await fs.readFile(translationFile, 'utf-8'));
  
  const surahData = surahJson.verse || {};
  const translationData = translationJson.verse || {};
  
  const verseKeys = Object.keys(surahData).filter(k => k.startsWith('verse_')).sort((a, b) => {
    const numA = parseInt(a.replace('verse_', ''));
    const numB = parseInt(b.replace('verse_', ''));
    return numA - numB;
  });
  
  console.log(`\nQuran file has ${verseKeys.length} verses\n`);
  
  for (const verseKey of verseKeys) {
    const ayahNum = parseInt(verseKey.replace('verse_', ''));
    const verseId = `1:${ayahNum}`;
    
    const arabic = surahData[verseKey];
    const english = translationData[verseKey];
    const tafseer = tafseerData[verseId];
    
    console.log(`\n${verseId}:`);
    console.log(`  Arabic: ${arabic ? arabic.substring(0, 50) + '...' : 'MISSING'}`);
    console.log(`  English: ${english ? english.substring(0, 60) + '...' : 'MISSING'}`);
    console.log(`  Tafseer: ${tafseer ? (tafseer.text ? 'YES (' + tafseer.text.length + ' chars)' : 'EMPTY') : 'MISSING'}`);
  }
  
  // Check Surah 2 verses
  console.log('\n\n=== Checking Surah 2 (first 5 verses) ===');
  const surah2File = path.join(quranPath, 'surah', 'surah_2.json');
  const translation2File = path.join(quranPath, 'translation', 'en', 'en_translation_2.json');
  
  const surah2Json = JSON.parse(await fs.readFile(surah2File, 'utf-8'));
  const translation2Json = JSON.parse(await fs.readFile(translation2File, 'utf-8'));
  
  const surah2Data = surah2Json.verse || {};
  const translation2Data = translation2Json.verse || {};
  
  for (let ayah = 1; ayah <= 5; ayah++) {
    const verseKey = `verse_${ayah}`;
    const verseId = `2:${ayah}`;
    
    const arabic = surah2Data[verseKey];
    const english = translation2Data[verseKey];
    const tafseer = tafseerData[verseId];
    
    console.log(`\n${verseId}:`);
    console.log(`  Arabic: ${arabic ? arabic.substring(0, 50) + '...' : 'MISSING'}`);
    console.log(`  English: ${english ? english.substring(0, 60) + '...' : 'MISSING'}`);
    console.log(`  Tafseer: ${tafseer ? (tafseer.text ? 'YES (' + tafseer.text.length + ' chars)' : 'EMPTY') : 'MISSING'}`);
    
    if (tafseer && tafseer.text) {
      // Extract clean text preview
      let preview = tafseer.text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 150);
      console.log(`  Preview: ${preview}...`);
    }
  }
  
  // Summary check
  console.log('\n\n=== SUMMARY CHECK ===');
  let totalQuranVerses = 0;
  let matchedVerses = 0;
  let versesWithTafseer = 0;
  
  for (let surah = 1; surah <= 114; surah++) {
    const surahFile = path.join(quranPath, 'surah', `surah_${surah}.json`);
    const surahJson = JSON.parse(await fs.readFile(surahFile, 'utf-8'));
    const verseKeys = Object.keys(surahJson.verse || {}).filter(k => k.startsWith('verse_'));
    
    for (const verseKey of verseKeys) {
      const ayahNum = parseInt(verseKey.replace('verse_', ''));
      const verseId = `${surah}:${ayahNum}`;
      totalQuranVerses++;
      
      if (tafseerData[verseId]) {
        matchedVerses++;
        if (tafseerData[verseId].text && tafseerData[verseId].text.trim().length > 0) {
          versesWithTafseer++;
        }
      }
    }
  }
  
  console.log(`Total verses in Quran: ${totalQuranVerses}`);
  console.log(`Verses with tafseer entry: ${matchedVerses} (${((matchedVerses/totalQuranVerses)*100).toFixed(1)}%)`);
  console.log(`Verses with tafseer text: ${versesWithTafseer} (${((versesWithTafseer/totalQuranVerses)*100).toFixed(1)}%)`);
  console.log(`Missing tafseer entries: ${totalQuranVerses - matchedVerses}`);
}

verifyMapping().catch(console.error);
