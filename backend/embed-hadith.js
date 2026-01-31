/**
 * Embed Hadith Script
 * Embeds Sahih Bukhari and Sahih Muslim using BGE embeddings
 */

const path = require('path');
const { VectorHadithSearch } = require('./ml-search/search/hadith-vector-search');

async function embedHadiths() {
  console.log('⏳ Initializing hadith vector search engine...');
  console.log('📚 Collections: Sahih Bukhari & Sahih Muslim\n');

  try {
    const vectorEngine = new VectorHadithSearch();

    // This will load hadiths and create embeddings if not already cached
    await vectorEngine.initialize();

    const info = await vectorEngine.getInfo();

    console.log('\n✅ EMBEDDING COMPLETE!\n');
    console.log('📊 Results:');
    console.log(`   Total hadiths: ${info.totalHadiths}`);
    console.log(`   Sahih Bukhari: ${info.stats.bukhari}`);
    console.log(`   Sahih Muslim: ${info.stats.muslim}`);
    console.log(`   Sunan an-Nasa'i: ${info.stats.nasai}`);
    console.log(`   Sunan Abi Dawud: ${info.stats.abudawud}`);
    console.log(`   Jami' at-Tirmidhi: ${info.stats.tirmidhi}`);
    console.log(`   Sunan Ibn Majah: ${info.stats.ibnmajah}`);
    console.log(`   Sunan an-Nasa'i: ${info.stats.nasai}`);
    console.log(`   Sunan Abi Dawud: ${info.stats.abudawud}`);
    console.log(`   Jami' at-Tirmidhi: ${info.stats.tirmidhi}`);
    console.log(`   Sunan Ibn Majah: ${info.stats.ibnmajah}`);
    console.log(`   Embedding model: ${info.embeddingModel}`);
    console.log(`   Reranker model: ${info.rerankerModel}`);
    console.log(`   Vector dimension: ${info.vectorDimension}`);
    console.log(`   Method: ${info.features[info.features.length - 1]}`);
    console.log('\n🎉 Vector database is ready for RAG search!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during embedding:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

embedHadiths();
