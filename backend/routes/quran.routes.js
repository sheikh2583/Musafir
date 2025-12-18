const express = require('express');
const router = express.Router();
const quranController = require('../controllers/quran.controller');

/**
 * Quran Routes
 * 
 * All routes serve data from local MongoDB only.
 * No external API dependencies.
 */

// Get all surahs metadata
router.get('/surahs', quranController.getAllSurahs);

// Get specific surah metadata
router.get('/surah/:surahNumber/metadata', quranController.getSurahMetadata);

// Get all ayahs for a surah
router.get('/surah/:surahNumber', quranController.getSurah);

// Get specific ayah
router.get('/ayah/:surahNumber/:ayahNumber', quranController.getAyah);

// Get juz
router.get('/juz/:juzNumber', quranController.getJuz);

// Get page (mushaf page view)
router.get('/page/:pageNumber', quranController.getPage);

// Get statistics
router.get('/stats', quranController.getStats);

module.exports = router;
