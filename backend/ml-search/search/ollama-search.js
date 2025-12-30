/**
 * Ollama-Powered Quran Search
 * Uses Ollama HTTP API (ollama app must be running)
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

class OllamaQuranSearch {
  constructor(modelName = 'qwen3:8b') {
    this.ollamaHost = 'localhost';
    this.ollamaPort = 11434;
    this.model = modelName;
    this.verses = [];
    this.versesMap = new Map();
    this.initialized = false;
  }

  async initialize() {
    console.log('[OllamaSearch] Initializing...');
    console.log(`[OllamaSearch] Ollama API: http://${this.ollamaHost}:${this.ollamaPort}`);
    console.log(`[OllamaSearch] Model: ${this.model}`);
    
    // Test connection to Ollama
    try {
      await this._testOllamaConnection();
      console.log('[OllamaSearch] ✅ Ollama service is running');
    } catch (error) {
      console.error('[OllamaSearch] ❌ Ollama service not accessible. Make sure "ollama app.exe" is running.');
      throw new Error('Ollama service not running. Please start "D:\\Musafir\\backend\\Ollama\\ollama app.exe"');
    }
    
    await this._loadVerses();
    
    console.log(`[OllamaSearch] ✅ Ready with ${this.verses.length} verses`);
    console.log('[OllamaSearch] Backend ready to handle search requests');
    this.initialized = true;
  }

  async _testOllamaConnection() {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/tags',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Ollama API returned ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timeout'));
      });
      req.end();
    });
  }

  async _loadVerses() {
    const quranPath = path.join(__dirname, '../../../quran');
    
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
          const verse = {
            id: `${surahNum}:${ayahNum}`,
            surah: surahNum,
            ayah: ayahNum,
            surahName: surahJson.name || `Surah ${surahNum}`,
            surahNameArabic: surahJson.name_arabic || '',
            arabic: surahData[verseKey],
            english: translationData[verseKey] || ''
          };
          
          if (verse.english) {
            this.verses.push(verse);
            this.versesMap.set(verse.id, verse);
          }
        }
      } catch (error) {
        console.error(`[OllamaSearch] Error loading surah ${surahNum}:`, error.message);
      }
    }
  }

  async search(query, options = {}) {
    if (!this.initialized) await this.initialize();

    console.log(`\n[OllamaSearch] 🔍 New search request: "${query}"`);
    console.log(`[OllamaSearch] Options: limit=${options.limit || 30}`);
    const startTime = Date.now();

    try {
      const prompt = `Query: "${query}"

Find 10-12 Quran verses that CLEARLY relate to this topic.

CRITERIA for each verse:
1. Must EXPLICITLY mention or discuss the topic
2. Connection should be OBVIOUS to any reader
3. Verse content directly addresses the query concept
4. No vague or tangential matches

Think: What are the key concepts in "${query}"? List verses where these concepts are clearly present.

Return 10-12 verse IDs in format: 2:255,3:103,4:1

Verses: `;

      const response = await this._callOllama(prompt);
      
      console.log(`[OllamaSearch] Raw response: "${response.substring(0, 200)}..."`);
      console.log(`[OllamaSearch] Full length: ${response.length} chars`);
      
      const verseIds = (response.match(/\d+:\d+/g) || []);
      const unique = [...new Set(verseIds)];
      
      console.log(`[OllamaSearch] Extracted ${unique.length} unique verse IDs from response`);
      if (unique.length > 0) {
        console.log(`[OllamaSearch] First few IDs: ${unique.slice(0, 5).join(', ')}`);
      }
      
      // Filter out invalid verse IDs (non-existent verses)
      const validResults = unique
        .map(id => this.versesMap.get(id))
        .filter(v => v);
      
      // If we got too few results, log warning
      if (validResults.length === 0) {
        console.log(`[OllamaSearch] ⚠️ No valid verses found for query: "${query}"`);
      } else if (validResults.length < 3) {
        console.log(`[OllamaSearch] ⚠️ Only ${validResults.length} verses found - query may be too specific`);
      }
      
      const results = validResults.slice(0, Math.min(options.limit || 12, 12));

      const duration = Date.now() - startTime;
      console.log(`[OllamaSearch] ✅ ${results.length} verses (${duration}ms)`);

      return {
        success: true,
        query,
        results: results.map((v, idx) => ({
          ...v,
          score: 1.0 - (idx * 0.02)
        })),
        metadata: {
          total: results.length,
          duration,
          model: this.model
        }
      };
    } catch (error) {
      console.error('[OllamaSearch] ❌', error.message);
      return {
        success: false,
        error: error.message,
        results: [],
        metadata: { duration: Date.now() - startTime }
      };
    }
  }

  async _callOllama(prompt) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const data = JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: true,
        options: {
          temperature: 0.05,
          num_predict: 70,
          top_k: 5,
          top_p: 0.65,
          repeat_penalty: 1.7,
          stop: ["\n\n", "\nCRITERIA", "\nThink"]
        },
        raw: true
      });
      
      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      console.log(`[OllamaSearch] Calling Ollama API (streaming)...`);
      
      const req = http.request(options, (res) => {
        let fullResponse = '';
        let buffer = '';
        
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
              const json = JSON.parse(line);
              if (json.response) {
                fullResponse += json.response;
              }
              if (json.thinking) {
                // Skip thinking tokens
              }
              if (json.done) {
                const duration = Date.now() - startTime;
                console.log(`[OllamaSearch] ✅ Response complete in ${duration}ms`);
                resolve(fullResponse);
                return;
              }
            } catch (e) {
              console.error('[OllamaSearch] Parse error:', e.message);
            }
          }
        });
        
        res.on('end', () => {
          if (fullResponse) {
            resolve(fullResponse);
          } else {
            reject(new Error('Empty response from Ollama'));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new Error(`API error: ${error.message}. Make sure "ollama app.exe" is running.`));
      });
      
      req.write(data);
      req.end();
    });
  }

  getInfo() {
    return {
      initialized: this.initialized,
      totalVerses: this.verses.length,
      model: this.model,
      backend: 'ollama-http-api'
    };
  }

  clearCache() {
    console.log('[OllamaSearch] No cache');
  }
}

module.exports = OllamaQuranSearch;
