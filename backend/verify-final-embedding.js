const { VectorQuranSearch } = require('./ml-search/search/vector-search');
const path = require('path');

async function verifyEmbedding() {
  console.log('=== VERIFYING VERSE EMBEDDING WITH TAFSEER RESOLUTION ===\n');
  
  const vectorEngine = new VectorQuranSearch();
  
  await vectorEngine.initialize();
  
  // Check specific verses that have references
  const testVerses = ['1:6', '1:7', '11:7', '11:8', '11:69', '11:70', '11:71'];
  
  console.log('Checking verses with tafseer:\n');
  
  for (const verseId of testVerses) {
    const verse = vectorEngine.versesMap.get(verseId);
    if (verse) {
      console.log(`📖 Verse ${verseId}:`);
      console.log(`   English: ${verse.english.substring(0, 60)}...`);
      console.log(`   Tafseer: ${verse.tafseer ? verse.tafseer.length : 0} chars`);
      if (verse.tafseer && verse.tafseer.length > 0) {
        console.log(`   Preview: ${verse.tafseer.substring(0, 100)}...`);
      }
      console.log();
    }
  }
  
  // Verify 1:7 has same tafseer as 1:6
  const verse16 = vectorEngine.versesMap.get('1:6');
  const verse17 = vectorEngine.versesMap.get('1:7');
  
  console.log('=== VERIFICATION: 1:6 vs 1:7 ===');
  console.log(`Verse 1:6 tafseer length: ${verse16.tafseer.length}`);
  console.log(`Verse 1:7 tafseer length: ${verse17.tafseer.length}`);
  console.log(`Are they equal? ${verse16.tafseer === verse17.tafseer ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n=== OVERALL STATISTICS ===');
  console.log(`Total verses: ${vectorEngine.verses.length}`);
  console.log(`Verses with tafseer: ${vectorEngine.tafseerStats.versesWithTafseer}`);
  console.log(`Coverage: ${((vectorEngine.tafseerStats.versesWithTafseer/vectorEngine.verses.length)*100).toFixed(1)}%`);
  console.log(`Average tafseer length: ${vectorEngine.tafseerStats.averageTafseerLength} chars`);
}

verifyEmbedding().catch(console.error);
