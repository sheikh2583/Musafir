/**
 * Standalone script to embed Quran verses with Tafseer Ibn Kathir
 * This creates vector embeddings and stores them in ChromaDB
 */

const { getSearchEngine } = require('./ml-search/search/vector-search');

async function embedTafseer() {
  console.log('🚀 Starting Tafseer Embedding Process...\n');
  console.log('📁 Source: en-tafisr-ibn-kathir.json');
  console.log('🎯 Target: ChromaDB with BGE embeddings\n');
  
  try {
    // Get vector search engine
    const vectorEngine = getSearchEngine();
    
    // Initialize (this loads tafseer, creates embeddings, and indexes)
    console.log('⏳ Initializing vector search engine...');
    await vectorEngine.initialize();
    
    // Get info
    const info = await vectorEngine.getInfo();
    
    console.log('\n✅ EMBEDDING COMPLETE!\n');
    console.log('📊 Results:');
    console.log(`   Total verses: ${info.verses}`);
    console.log(`   Indexed: ${info.indexed}`);
    console.log(`   Verses with tafseer: ${info.tafseerStats?.versesWithTafseer || 'N/A'}`);
    console.log(`   Average tafseer length: ${info.tafseerStats?.averageTafseerLength || 'N/A'} chars`);
    console.log(`   Model: ${info.model}`);
    console.log(`   Method: ${info.method}`);
    console.log('\n🎉 Vector database is ready for RAG search!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
embedTafseer();
