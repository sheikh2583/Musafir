const express = require('express');
const router = express.Router();
const quranController = require('../controllers/quran.controller');

/**
 * Quran Routes
 * 
 * All routes serve data from local JSON files only.
 * No external API or database dependencies.
 */

// Get statistics - MUST be before other routes
router.get('/stats', quranController.getStats);

// Get all surahs metadata
router.get('/surahs', quranController.getAllSurahs);

// Get all juz metadata
router.get('/juz', quranController.getAllJuz);

// Get specific juz
router.get('/juz/:juzNumber', quranController.getJuz);

// Search ayahs
router.get('/search', quranController.searchAyah);

// Get specific surah metadata
router.get('/surah/:surahNumber/metadata', quranController.getSurahMetadata);

// Get specific ayah
router.get('/surah/:surahNumber/ayah/:ayahNumber', quranController.getAyah);

// Get all ayahs for a surah
router.get('/surah/:surahNumber', quranController.getSurah);

module.exports = router;
