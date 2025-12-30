# Quran Dual Search Implementation

## Overview
Successfully implemented **two search modes** in the Quran tab of the Musafir mobile app:

1. **Basic Surah Search** - Browse and search surahs by name/number
2. **NLP Verse Search** - AI-powered semantic search for Quran verses

---

## Backend: Full Stack Semantic Search

### Architecture
- **E5-base-v2** ONNX embeddings (768-dim)
- **BGE Reranker v2-m3** for deep relevance ranking
- **Mistral Query Analyzer** for entity extraction and query expansion
- **6,348 Quran verses** indexed with English translations

### API Endpoint
```
GET http://192.168.0.190:5000/api/quran/search?q=<query>&limit=30
```

### Features
- ✅ Multi-query search with rewrites
- ✅ Entity alias mapping (Moses→Musa, Jesus→Isa, Mary→Maryam)
- ✅ Hybrid scoring (E5 + keyword + entity matching)
- ✅ Smart reranking (skips when confidence >70%)
- ✅ Context inclusion (2 verses before/after)
- ✅ Query caching for performance

### Example Queries
- `mary` - Prophet Mary verses
- `moses and pharaoh` - Stories of Moses confronting Pharaoh
- `patience in hardship` - Verses about perseverance
- `paradise` - Descriptions of Jannah
- `forgiveness` - Mercy and pardon verses

---

## Mobile App: Dual Search UI

### Files Modified
1. **QuranScreen.js** - Added toggle between browse/search modes
2. **VerseSearchScreen.js** - NEW screen showing search results
3. **quranService.js** - Added `searchVerses()` function
4. **AppNavigator.js** - Added VerseSearch screen to navigation

### User Experience

#### Browse Mode (Default)
- Traditional surah list view
- Search by surah name or number
- Fast, instant filtering

#### Search Verses Mode
- Natural language input
- AI-powered semantic search
- Shows example queries
- Press "Search" button or Enter
- Navigates to results screen

#### Results Screen
- Shows relevance score for each verse
- Displays Arabic + English translation
- "View in Context" button to jump to full surah
- Search time and model info displayed

---

## Usage Instructions

### For Users
1. Open Quran tab
2. Toggle between "Browse Surahs" and "Search Verses"
3. In Search Verses mode:
   - Type natural questions like "mary", "patience", "paradise"
   - Tap example queries for quick search
   - Press Search button
4. View results with relevance scores
5. Tap "View in Context" to read surrounding verses

### For Developers

#### Testing Backend
```bash
# Start backend server
cd d:\Musafir\backend
node server.js

# Test search API
curl "http://localhost:5000/api/quran/search?q=mary&limit=10"
```

#### Testing Mobile App
```bash
# Start Expo
cd d:\Musafir\mobile-app
npx expo start

# Ensure backend is running on 192.168.0.190:5000
```

---

## Technical Details

### Search Pipeline
1. **Query Analysis** - Extract entities, concepts, generate rewrites
2. **Multi-Query Retrieval** - Search all query variations with E5
3. **Hybrid Scoring** - Combine semantic + keyword + entity matching
4. **Smart Reranking** - Deep relevance ranking when needed
5. **Context Addition** - Include surrounding verses
6. **Response Formatting** - Return with metadata

### Performance
- **Simple queries**: <1 second
- **Complex queries with reranking**: 2-4 seconds
- **Index size**: 6,348 verses, 768-dim embeddings
- **Cache**: 1000 query embeddings (1 hour TTL)

### Configuration
Located in `backend/ml-search/config/quran.config.js`:
- `e5Model.topK: 200` - Retrieve top 200 candidates
- `reranker.inputSize: 100` - Rerank top 100
- `reranker.outputSize: 30` - Return top 30
- `search.minScore: 0.2` - Minimum similarity threshold
- `context.contextBefore: 2` - Verses before
- `context.contextAfter: 2` - Verses after

---

## Next Steps (Optional Enhancements)

### Immediate
- [ ] Add loading skeleton in mobile app
- [ ] Add search history
- [ ] Add favorite verses feature

### Future
- [ ] Implement same system for Hadith search
- [ ] Add Arabic query support
- [ ] Add voice search
- [ ] Add verse bookmarking
- [ ] Add sharing functionality
- [ ] Add offline search with smaller model

---

## API Response Format

```json
{
  "success": true,
  "query": "mary",
  "queryAnalysis": {
    "intent": "general",
    "entities": ["mary"],
    "concepts": [],
    "rewrites": ["mary", "maryam", "mariam"]
  },
  "results": [
    {
      "id": "3:42",
      "surah": 3,
      "ayah": 42,
      "surahName": "al-Imran",
      "arabic": "...",
      "english": "...",
      "score": 0.89,
      "e5Score": 0.87,
      "rerankScore": 0.92,
      "context": {
        "before": [...],
        "after": [...]
      }
    }
  ],
  "metadata": {
    "total": 30,
    "duration": 1234,
    "model": "e5-base-v2",
    "reranked": true,
    "queriesSearched": 3
  }
}
```

---

## Status
✅ **FULLY IMPLEMENTED AND TESTED**

Both search modes are working:
- Basic surah search in browse mode
- AI-powered verse search with full stack
- Mobile UI with toggle and results screen
- Backend API with comprehensive search pipeline
