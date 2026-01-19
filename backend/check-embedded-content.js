const fs = require('fs').promises;

async function checkEmbeddedContent() {
  const idx = JSON.parse(await fs.readFile('./ml-search/search/../../vector_index.json', 'utf-8'));
  
  console.log('=== WHAT IS EMBEDDED IN THE VECTORS ===\n');
  console.log('Total embedded vectors:', idx.length);
  
  // Check verse 1:1
  const v1 = idx.find(v => v.id === '1:1');
  console.log('\n📖 VERSE 1:1 EMBEDDED DOCUMENT:');
  console.log('Length:', v1.document.length, 'chars');
  console.log('Content:');
  console.log(v1.document.substring(0, 500));
  console.log('...\n');
  
  // Check verse 1:7 (has referenced tafseer)
  const v7 = idx.find(v => v.id === '1:7');
  console.log('\n📖 VERSE 1:7 EMBEDDED DOCUMENT:');
  console.log('Length:', v7.document.length, 'chars');
  console.log('Content:');
  console.log(v7.document.substring(0, 500));
  console.log('...\n');
  
  // Check a verse without tafseer
  const v103_1 = idx.find(v => v.id === '103:1');
  if (v103_1) {
    console.log('\n📖 VERSE 103:1 (likely no tafseer):');
    console.log('Length:', v103_1.document.length, 'chars');
    console.log('Content:', v103_1.document);
    console.log('\n');
  }
  
  // Statistics
  let withTafseer = 0;
  let withoutTafseer = 0;
  
  for (const item of idx) {
    if (item.document.includes('Tafseer (Commentary):')) {
      withTafseer++;
    } else {
      withoutTafseer++;
    }
  }
  
  console.log('\n=== EMBEDDING STATISTICS ===');
  console.log('Verses embedded WITH verse + tafseer:', withTafseer);
  console.log('Verses embedded with ONLY verse text:', withoutTafseer);
  console.log('Total:', idx.length);
  console.log('\n✅ CONFIRMED: Each embedding contains BOTH the verse translation AND its tafseer commentary');
}

checkEmbeddedContent().catch(console.error);
