import api from './api';

/**
 * Quran Service
 * 
 * All API calls for Quran features.
 * Data is served from local MongoDB - fully offline after initial load.
 */

/**
 * Get all surah metadata
 * @returns {Promise} Array of surah metadata
 */
export const getAllSurahs = async () => {
  try {
    const response = await api.get('/quran/surahs');
    // Backend returns { success, count, data }
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

/**
 * Get metadata for a specific surah
 * @param {number} surahNumber - Surah number (1-114)
 * @returns {Promise} Surah metadata
 */
export const getSurahMetadata = async (surahNumber) => {
  try {
    const response = await api.get(`/quran/surah/${surahNumber}/metadata`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber} metadata:`, error);
    throw error;
  }
};

/**
 * Get all ayahs for a specific surah
 * @param {number} surahNumber - Surah number (1-114)
 * @param {boolean} includeTranslation - Whether to include translations
 * @returns {Promise} Array of ayahs
 */
export const getSurah = async (surahNumber, includeTranslation = true) => {
  try {
    const response = await api.get(`/quran/surah/${surahNumber}`, {
      params: { includeTranslation }
    });
    // Backend returns { success, surahNumber, metadata, ayahCount, data }
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Get a specific ayah
 * @param {number} surahNumber - Surah number (1-114)
 * @param {number} ayahNumber - Ayah number
 * @returns {Promise} Single ayah data
 */
export const getAyah = async (surahNumber, ayahNumber) => {
  try {
    const response = await api.get(`/quran/ayah/${surahNumber}/${ayahNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ayah ${surahNumber}:${ayahNumber}:`, error);
    throw error;
  }
};

/**
 * Get ayahs by juz
 * @param {number} juzNumber - Juz number (1-30)
 * @returns {Promise} Array of ayahs in the juz
 */
export const getJuz = async (juzNumber) => {
  try {
    const response = await api.get(`/quran/juz/${juzNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching juz ${juzNumber}:`, error);
    throw error;
  }
};

/**
 * Get ayahs by page (mushaf page)
 * @param {number} pageNumber - Page number (1-604)
 * @returns {Promise} Array of ayahs on the page
 */
export const getPage = async (pageNumber) => {
  try {
    const response = await api.get(`/quran/page/${pageNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    throw error;
  }
};

/**
 * Get Quran database statistics
 * @returns {Promise} Statistics object
 */
export const getQuranStats = async () => {
  try {
    const response = await api.get('/quran/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching Quran stats:', error);
    throw error;
  }
};

/**
 * Search verses using semantic/NLP search
 * @param {string} query - Natural language search query
 * @param {object} options - Search options (limit, includeContext, etc.)
 * @returns {Promise} Search results with verses
 */
export const searchVerses = async (query, options = {}) => {
  try {
    const params = {
      q: query,
      limit: options.limit || 30,
      includeContext: options.includeContext !== false
    };
    
    const response = await api.get('/quran/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
};

export default {
  getSurahs: getAllSurahs, // Alias for consistency
  getAllSurahs,
  getSurahMetadata,
  getSurah,
  getAyah,
  getJuz,
  getPage,
  getQuranStats,
  searchVerses
};
