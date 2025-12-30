/**
 * Quran Search Controller
 * Handles semantic search API requests
 */

const OllamaQuranSearch = require('../search/ollama-search');

// Singleton instance
let searchEngine = null;

/**
 * Get or create search engine instance
 */
const getSearchEngine = async () => {
  if (!searchEngine) {
    searchEngine = new OllamaQuranSearch();
    await searchEngine.initialize();
  }
  return searchEngine;
};

/**
 * Search Quran verses
 * GET /api/quran/search?q=mary&limit=10&includeContext=true
 */
exports.search = async (req, res) => {
  try {
    const { q, limit, includeContext } = req.query;

    // Validate query
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    if (q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters'
      });
    }

    if (q.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Query too long (max 500 characters)'
      });
    }

    // Get search engine
    const engine = await getSearchEngine();

    // Parse options
    const options = {
      limit: limit ? parseInt(limit) : undefined,
      includeContext: includeContext !== 'false' // Default true
    };

    // Perform search
    const results = await engine.search(q, options);

    res.json(results);
  } catch (error) {
    console.error('[QuranSearchController] Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
};

/**
 * Get search engine info
 * GET /api/quran/search/info
 */
exports.getInfo = async (req, res) => {
  try {
    const engine = await getSearchEngine();
    const info = engine.getInfo();
    
    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('[QuranSearchController] Info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get info',
      message: error.message
    });
  }
};

/**
 * Clear query cache
 * POST /api/quran/search/cache/clear
 */
exports.clearCache = async (req, res) => {
  try {
    const engine = await getSearchEngine();
    engine.clearCache();
    
    res.json({
      success: true,
      message: 'Cache cleared'
    });
  } catch (error) {
    console.error('[QuranSearchController] Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
};

/**
 * Health check
 * GET /api/quran/search/health
 */
exports.health = async (req, res) => {
  try {
    const engine = await getSearchEngine();
    const info = engine.getInfo();
    
    res.json({
      success: true,
      status: info.initialized ? 'ready' : 'initializing',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'error',
      error: error.message
    });
  }
};
