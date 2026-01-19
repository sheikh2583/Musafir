import api from './api';
import LOCAL_QURAN_DATA from '../data/quran_data.json';

/**
 * Quran Service
 * 
 * All API calls for Quran features.
 * Data is served from LOCAL BUNDLE (offline) for reliability.
 */

/**
 * Get all surah metadata
 * @returns {Promise} Array of surah metadata
 */
export const getAllSurahs = async () => {
  // Return local data mapped to expectation
  return LOCAL_QURAN_DATA.map(s => ({
    number: parseInt(s.index),
    name: s.name,
    englishName: s.name, // Simplified
    numberOfAyahs: s.count || Object.keys(s.verse).length
  }));
};

/**
 * Get metadata for a specific surah
 * @param {number} surahNumber - Surah number (1-114)
 * @returns {Promise} Surah metadata
 */
export const getSurahMetadata = async (surahNumber) => {
  const s = LOCAL_QURAN_DATA.find(x => parseInt(x.index) === surahNumber);
  if (!s) throw new Error('Surah not found');
  return {
    number: parseInt(s.index),
    name: s.name,
    numberOfAyahs: Object.keys(s.verse).length
  };
};

/**
 * Get all ayahs for a specific surah
 * @param {number} surahNumber - Surah number (1-114)
 * @param {boolean} includeTranslation - Whether to include translations
 * @returns {Promise} Array of ayahs
 */
export const getSurah = async (surahNumber, includeTranslation = true) => {
  const s = LOCAL_QURAN_DATA.find(x => parseInt(x.index) === surahNumber);
  if (!s) throw new Error('Surah not found');

  // Convert verse object { "verse_1": "text" } to array
  const ayahs = Object.entries(s.verse).map(([key, text], index) => ({
    number: index + 1,
    text: text,
    numberInSurah: index + 1,
    juz: s.juz ? s.juz[0].index : 1 // Simplified
  }));

  return {
    number: parseInt(s.index),
    name: s.name,
    ayahs: ayahs
  };
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
