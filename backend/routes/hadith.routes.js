const express = require('express');
const router = express.Router();
const hadithController = require('../controllers/hadith.controller');

/**
 * Hadith Routes
 * 
 * All routes serve data from local MongoDB only.
 * No external API dependencies.
 */

// Get list of available collections
router.get('/collections', hadithController.getCollections);

// Get books/chapters for a collection
router.get('/:collection/books', hadithController.getBooks);

// Get hadith from a specific collection (paginated)
router.get('/:collection', hadithController.getCollectionHadith);

// Get specific hadith by number
router.get('/:collection/:hadithNumber', hadithController.getHadith);

// Get statistics
router.get('/stats/all', hadithController.getStats);

module.exports = router;
