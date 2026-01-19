/**
 * Complete RAG System for Quran Search
 * Uses BGE embeddings + Local Vector Storage + BGE reranker
 * Full tafseer embedding and retrieval
 */

const { pipeline } = require('@xenova/transformers');
const fs = require('fs').promises;
const path = require('path');

class VectorQuranSearch {
  constructor() {
    this.embedder = null;
    this.reranker = null;
    this.initialized = false;
    this.verses = [];
    this.versesMap = new Map();
    this.vectorIndex = []; // Local vector storage
    this.indexPath = path.join(__dirname, '../../vector_index.json');
    this.tafseerStats = {
      totalVerses: 0,
      versesWithTafseer: 0,
      averageTafseerLength: 0
    };
  }

  async initialize() {
    console.log('[VectorRAG] 🚀 Initializing Complete RAG System...');
    
    try {
      // Initialize embedding model
      console.log('[VectorRAG] Loading BGE-base-en-v1.5 embedding model...');
      this.embedder = await pipeline('feature-extraction', 'Xenova/bge-base-en-v1.5', {
        quantized: false // Use full precision for better quality
      });
      console.log('[VectorRAG] ✅ Embedding model loaded');
      
      // Initialize reranker model
      console.log('[VectorRAG] Loading BGE reranker model...');
      this.reranker = await pipeline('text-classification', 'Xenova/bge-reranker-base');
      console.log('[VectorRAG] ✅ Reranker model loaded');
      
      // Load Quran verses and tafseer
      await this._loadVersesAndTafseer();
      
      // Load or create vector index
      try {
        const indexExists = await fs.access(this.indexPath).then(() => true).catch(() => false);
        
        if (indexExists) {
          console.log('[VectorRAG] Loading existing vector index...');
          const indexData = await fs.readFile(this.indexPath, 'utf-8');
          this.vectorIndex = JSON.parse(indexData);
          console.log(`[VectorRAG] ✅ Loaded ${this.vectorIndex.length} vectors from cache`);
          
          // Check if index is complete
          if (this.vectorIndex.length < this.verses.length) {
            console.log(`[VectorRAG] ⚠️ Partial index detected (${this.vectorIndex.length}/${this.verses.length}), re-indexing...`);
            await this._indexVerses();
          }
        } else {
          console.log('[VectorRAG] No existing index found, starting complete indexing...');
          await this._indexVerses();
        }
      } catch (error) {
        console.error('[VectorRAG] Index loading error:', error.message);
        console.log('[VectorRAG] Creating new index...');
        await this._indexVerses();
      }
      
      this.initialized = true;
      console.log(`[VectorRAG] ✅ Complete RAG System Ready!`);
      console.log(`[VectorRAG] 📊 Total verses: ${this.verses.length}`);
      console.log(`[VectorRAG] 📖 Verses with tafseer: ${this.tafseerStats.versesWithTafseer}`);
      console.log(`[VectorRAG] 📝 Average tafseer length: ${this.tafseerStats.averageTafseerLength} chars`);
      
    } catch (error) {
      console.error('[VectorRAG] ❌ Initialization failed:', error.message);
      throw error;
    }
  }

  async _loadVersesAndTafseer() {
    console.log('[VectorRAG] Loading verses and complete tafseer...');
    
    const quranPath = path.join(__dirname, '../../../quran');
    const tafseerPath = path.join(__dirname, '../../../en-tafisr-ibn-kathir.json/en-tafisr-ibn-kathir.json');
    
    // Load tafseer
    let tafseerData = {};
    try {
      const tafseerContent = await fs.readFile(tafseerPath, 'utf-8');
      tafseerData = JSON.parse(tafseerContent);
      console.log('[VectorRAG] ✅ Complete tafseer database loaded');
    } catch (error) {
      console.error('[VectorRAG] ⚠️ Tafseer load error:', error.message);
      console.log('[VectorRAG] Continuing without tafseer...');
    }
    
    let totalTafseerLength = 0;
    let versesWithTafseer = 0;
    
    // Load verses
    for (let surahNum = 1; surahNum <= 114; surahNum++) {
      try {
        const surahFile = path.join(quranPath, 'surah', `surah_${surahNum}.json`);
        const translationFile = path.join(quranPath, 'translation', 'en', `en_translation_${surahNum}.json`);
        
        const surahJson = JSON.parse(await fs.readFile(surahFile, 'utf-8'));
        const translationJson = JSON.parse(await fs.readFile(translationFile, 'utf-8'));
        
        const surahData = surahJson.verse || {};
        const translationData = translationJson.verse || {};
        
        const verseKeys = Object.keys(surahData).filter(k => k.startsWith('verse_'));
        
        for (const verseKey of verseKeys) {
          const ayahNum = parseInt(verseKey.replace('verse_', ''));
          const verseId = `${surahNum}:${ayahNum}`;
          
          // Get complete tafseer for this verse (resolve references)
          const tafseer = this._extractTafseerText(tafseerData, verseId);
          
          if (tafseer.length > 0) {
            versesWithTafseer++;
            totalTafseerLength += tafseer.length;
          }
          
          const verse = {
            id: verseId,
            surah: surahNum,
            ayah: ayahNum,
            surahName: surahJson.name || `Surah ${surahNum}`,
            surahNameArabic: surahJson.name_arabic || '',
            arabic: surahData[verseKey],
            english: translationData[verseKey] || '',
            tafseer: tafseer,
            tafseerLength: tafseer.length
          };
          
          if (verse.english) {
            this.verses.push(verse);
            this.versesMap.set(verseId, verse);
          }
        }
      } catch (error) {
        console.error(`[VectorRAG] Error loading surah ${surahNum}:`, error.message);
      }
    }
    
    // Calculate statistics
    this.tafseerStats.totalVerses = this.verses.length;
    this.tafseerStats.versesWithTafseer = versesWithTafseer;
    this.tafseerStats.averageTafseerLength = versesWithTafseer > 0 
      ? Math.round(totalTafseerLength / versesWithTafseer) 
      : 0;
    
    console.log(`[VectorRAG] ✅ Loaded ${this.verses.length} verses`);
    console.log(`[VectorRAG] 📖 ${versesWithTafseer} verses have tafseer (${((versesWithTafseer/this.verses.length)*100).toFixed(1)}%)`);
  }

  _extractTafseerText(tafseerData, verseId) {
    if (!tafseerData || !verseId) return '';
    
    let tafseerEntry = tafseerData[verseId];
    
    // If the tafseer is a string reference to another verse, resolve it
    if (typeof tafseerEntry === 'string') {
      const referencedVerseId = tafseerEntry;
      tafseerEntry = tafseerData[referencedVerseId];
      
      // Prevent infinite loops - max 5 reference hops
      let hops = 0;
      while (typeof tafseerEntry === 'string' && hops < 5) {
        tafseerEntry = tafseerData[tafseerEntry];
        hops++;
      }
    }
    
    // Now extract the actual text
    if (!tafseerEntry || !tafseerEntry.text) return '';
    
    // Remove HTML tags and clean text
    let text = tafseerEntry.text
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '\n')
      .replace(/<p[^>]*>/g, '\n')
      .replace(/<\/p>/g, '\n')
      .replace(/<span[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // Keep full tafseer for comprehensive RAG
    // Max 8000 chars to balance quality and performance
    if (text.length > 8000) {
      text = text.substring(0, 8000) + '...';
    }
    
    return text;
  }

  async _indexVerses() {
    console.log('[VectorRAG] 🚀 Starting complete verse indexing with full tafseer...');
    console.log('[VectorRAG] This will take 10-15 minutes for first-time indexing');
    
    this.vectorIndex = []; // Reset index
    const batchSize = 32; // Optimized batch size
    let indexedCount = 0;
    const startTime = Date.now();
    
    for (let i = 0; i < this.verses.length; i += batchSize) {
      const batch = this.verses.slice(i, i + batchSize);
      
      // Create rich documents with translation + full tafseer
      const documents = batch.map(v => {
        // Format: Translation first, then tafseer for better relevance
        const parts = [v.english];
        if (v.tafseer && v.tafseer.length > 0) {
          parts.push(`\n\nTafseer (Commentary): ${v.tafseer}`);
        }
        return parts.join(' ');
      });
      
      try {
        // Generate embeddings with progress tracking
        const embeddings = await this._generateEmbeddings(documents);
        
        // Add to local vector index
        for (let j = 0; j < batch.length; j++) {
          const verse = batch[j];
          this.vectorIndex.push({
            id: verse.id,
            embedding: Array.from(embeddings[j]),
            document: documents[j],
            metadata: {
              surah: verse.surah,
              ayah: verse.ayah,
              surahName: verse.surahName,
              english: verse.english.substring(0, 500),
              hasTafseer: verse.tafseer.length > 0,
              tafseerLength: verse.tafseerLength
            }
          });
        }
        
        indexedCount += batch.length;
        
        // Progress updates every 200 verses
        if (indexedCount % 200 === 0 || indexedCount === this.verses.length) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = (indexedCount / elapsed).toFixed(1);
          const remaining = ((this.verses.length - indexedCount) / rate).toFixed(0);
          
          console.log(`[VectorRAG] 📊 Progress: ${indexedCount}/${this.verses.length} verses (${((indexedCount/this.verses.length)*100).toFixed(1)}%)`);
          console.log(`[VectorRAG] ⏱️  Rate: ${rate} verses/sec | ETA: ${remaining}s`);
        }
      } catch (error) {
        console.error(`[VectorRAG] ❌ Indexing error at batch ${i}:`, error.message);
        // Continue with next batch
      }
    }
    
    // Save index to file
    try {
      console.log('[VectorRAG] 💾 Saving vector index to disk...');
      await fs.writeFile(this.indexPath, JSON.stringify(this.vectorIndex), 'utf-8');
      console.log('[VectorRAG] ✅ Vector index saved successfully');
    } catch (error) {
      console.error('[VectorRAG] ⚠️ Failed to save vector index:', error.message);
    }
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[VectorRAG] ✅ Indexing complete in ${totalTime}s`);
    console.log(`[VectorRAG] 📦 Indexed ${indexedCount} verses with full tafseer`);
  }

  async _generateEmbeddings(texts) {
    const embeddings = [];
    
    for (const text of texts) {
      try {
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(output.data));
      } catch (error) {
        console.error('[VectorSearch] Embedding error:', error.message);
        // Push zero vector as fallback
        embeddings.push(new Array(768).fill(0));
      }
    }
    
    return embeddings;
  }

  async search(query, options = {}) {
    if (!this.initialized) await this.initialize();

    console.log(`\n[VectorRAG] 🔍 Query: "${query}"`);
    const startTime = Date.now();

    try {
      const limit = options.limit || 7;
      const useReranker = options.rerank !== false; // Default true
      
      // Step 1: Generate query embedding
      const embeddingStart = Date.now();
      const queryEmbedding = await this._generateEmbeddings([query]);
      const embeddingTime = Date.now() - embeddingStart;
      console.log(`[VectorRAG] ⚡ Query embedded in ${embeddingTime}ms`);
      
      // Step 2: Calculate cosine similarity with all vectors
      const retrievalStart = Date.now();
      const candidateLimit = useReranker ? limit * 3 : limit;
      
      const similarities = this.vectorIndex.map(item => ({
        ...item,
        similarity: this._cosineSimilarity(queryEmbedding[0], item.embedding)
      }));
      
      // Sort by similarity (descending) and take top candidates
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topCandidates = similarities.slice(0, candidateLimit);
      
      const retrievalTime = Date.now() - retrievalStart;
      console.log(`[VectorRAG] 📚 Retrieved ${topCandidates.length} candidates in ${retrievalTime}ms`);
      
      // Step 3: Process initial results
      let verses = topCandidates.map(item => {
        const verse = this.versesMap.get(item.id);
        return {
          ...verse,
          distance: 1 - item.similarity,
          initialScore: item.similarity
        };
      });
      
      // Step 4: Rerank if enabled
      if (useReranker && this.reranker && verses.length > limit) {
        const rerankStart = Date.now();
        console.log(`[VectorRAG] 🎯 Reranking ${verses.length} candidates...`);
        
        verses = await this._rerankResults(query, verses);
        verses = verses.slice(0, limit); // Take top N after reranking
        
        const rerankTime = Date.now() - rerankStart;
        console.log(`[VectorRAG] ✨ Reranked to top ${limit} in ${rerankTime}ms`);
      } else {
        verses = verses.slice(0, limit);
      }
      
      // Step 5: Calculate final scores and relevance
      verses = verses.map((v, idx) => ({
        ...v,
        score: v.rerankScore || v.initialScore,
        relevance: Math.round((v.rerankScore || v.initialScore) * 100),
        rank: idx + 1
      }));
      
      const duration = Date.now() - startTime;
      console.log(`[VectorRAG] ✅ ${verses.length} verses retrieved in ${duration}ms`);
      console.log(`[VectorRAG] 🏆 Top result: ${verses[0]?.id} (${verses[0]?.relevance}% relevant)`);

      return {
        success: true,
        query,
        results: verses,
        metadata: {
          total: verses.length,
          duration,
          method: 'rag-vector-rerank',
          useReranker,
          timings: {
            embedding: embeddingTime,
            retrieval: retrievalTime,
            total: duration
          }
        }
      };
    } catch (error) {
      console.error('[VectorRAG] ❌ Search error:', error.message);
      return {
        success: false,
        error: error.message,
        results: [],
        metadata: { duration: Date.now() - startTime }
      };
    }
  }

  async _rerankResults(query, verses) {
    try {
      // Prepare pairs for reranking
      const pairs = verses.map(v => {
        // Use translation + short tafseer snippet for reranking
        const context = v.tafseer && v.tafseer.length > 0
          ? `${v.english} ${v.tafseer.substring(0, 500)}`
          : v.english;
        return [query, context];
      });
      
      // Batch reranking
      const batchSize = 16;
      const scores = [];
      
      for (let i = 0; i < pairs.length; i += batchSize) {
        const batch = pairs.slice(i, i + batchSize);
        
        // Get reranker scores
        for (const pair of batch) {
          try {
            const result = await this.reranker(pair[0], pair[1]);
            // Extract relevance score
            const score = result[0]?.score || 0;
            scores.push(score);
          } catch (error) {
            console.error('[VectorRAG] Rerank error:', error.message);
            scores.push(0);
          }
        }
      }
      
      // Attach scores and sort
      verses.forEach((v, idx) => {
        v.rerankScore = scores[idx];
      });
      
      // Sort by rerank score (descending)
      verses.sort((a, b) => b.rerankScore - a.rerankScore);
      
      return verses;
    } catch (error) {
      console.error('[VectorRAG] Reranking failed:', error.message);
      // Fallback to initial ordering
      return verses;
    }
  }

  _cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async getInfo() {
    if (!this.initialized) {
      return {
        initialized: false,
        verses: 0
      };
    }
    
    return {
      initialized: this.initialized,
      verses: this.verses.length,
      indexed: this.vectorIndex.length,
      method: 'rag-vector-rerank',
      model: 'bge-base-en-v1.5',
      reranker: 'bge-reranker-base',
      storage: 'local-file-based',
      tafseerStats: this.tafseerStats,
      features: [
        'Full tafseer embedding (up to 8000 chars)',
        'BGE embeddings for semantic search',
        'Local vector storage with cosine similarity',
        'BGE reranker for result refinement',
        'Complete RAG pipeline'
      ]
    };
  }
}

// Singleton instance
let instance = null;

function getSearchEngine() {
  if (!instance) {
    instance = new VectorQuranSearch();
  }
  return instance;
}

module.exports = { VectorQuranSearch, getSearchEngine };
