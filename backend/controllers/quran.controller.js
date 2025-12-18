const Quran = require('../models/Quran.model');
const SurahMetadata = require('../models/SurahMetadata.model');

/**
 * Quran Controller
 * 
 * Handles all Quran-related requests.
 * All data served from local MongoDB - NO external APIs.
 * Optimized for offline-first operation.
 */

/**
 * Get all surah metadata
 * GET /api/quran/surahs
 */
exports.getAllSurahs = async (req, res) => {
  try {
    const surahs = await SurahMetadata.find()
      .select('-__v -createdAt -updatedAt')
      .sort({ surahNumber: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: surahs.length,
      data: surahs
    });
  } catch (error) {
    console.error('Error fetching surahs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surah list'
    });
  }
};

/**
 * Get metadata for a specific surah
 * GET /api/quran/surah/:surahNumber/metadata
 */
exports.getSurahMetadata = async (req, res) => {
  try {
    const { surahNumber } = req.params;
    const surahNum = parseInt(surahNumber);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return res.status(400).json({
        success: false,
        message: 'Invalid surah number. Must be between 1 and 114.'
      });
    }

    const metadata = await SurahMetadata.findOne({ surahNumber: surahNum })
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: `Surah ${surahNum} metadata not found`
      });
    }

    res.status(200).json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error fetching surah metadata:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surah metadata'
    });
  }
};

/**
 * Get all ayahs for a specific surah
 * GET /api/quran/surah/:surahNumber
 * Query params: includeTranslation (boolean)
 */
exports.getSurah = async (req, res) => {
  try {
    const { surahNumber } = req.params;
    const { includeTranslation = 'true' } = req.query;
    const surahNum = parseInt(surahNumber);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return res.status(400).json({
        success: false,
        message: 'Invalid surah number. Must be between 1 and 114.'
      });
    }

    // Build projection based on translation preference
    let projection = '-__v -createdAt -updatedAt';
    if (includeTranslation === 'false') {
      projection += ' -translationEn -translationBn';
    }

    const ayahs = await Quran.find({ surah: surahNum })
      .select(projection)
      .sort({ ayah: 1 })
      .lean();

    if (!ayahs || ayahs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Surah ${surahNum} not found`
      });
    }

    res.status(200).json({
      success: true,
      surah: surahNum,
      count: ayahs.length,
      data: ayahs
    });
  } catch (error) {
    console.error('Error fetching surah:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surah'
    });
  }
};

/**
 * Get a specific ayah
 * GET /api/quran/ayah/:surahNumber/:ayahNumber
 */
exports.getAyah = async (req, res) => {
  try {
    const { surahNumber, ayahNumber } = req.params;
    const surahNum = parseInt(surahNumber);
    const ayahNum = parseInt(ayahNumber);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return res.status(400).json({
        success: false,
        message: 'Invalid surah number. Must be between 1 and 114.'
      });
    }

    if (isNaN(ayahNum) || ayahNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ayah number.'
      });
    }

    const ayah = await Quran.findOne({ 
      surah: surahNum, 
      ayah: ayahNum 
    })
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!ayah) {
      return res.status(404).json({
        success: false,
        message: `Ayah ${surahNum}:${ayahNum} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: ayah
    });
  } catch (error) {
    console.error('Error fetching ayah:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ayah'
    });
  }
};

/**
 * Get ayahs by juz
 * GET /api/quran/juz/:juzNumber
 */
exports.getJuz = async (req, res) => {
  try {
    const { juzNumber } = req.params;
    const juzNum = parseInt(juzNumber);

    if (isNaN(juzNum) || juzNum < 1 || juzNum > 30) {
      return res.status(400).json({
        success: false,
        message: 'Invalid juz number. Must be between 1 and 30.'
      });
    }

    const ayahs = await Quran.find({ 'metadata.juz': juzNum })
      .select('-__v -createdAt -updatedAt')
      .sort({ surah: 1, ayah: 1 })
      .lean();

    if (!ayahs || ayahs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Juz ${juzNum} not found`
      });
    }

    res.status(200).json({
      success: true,
      juz: juzNum,
      count: ayahs.length,
      data: ayahs
    });
  } catch (error) {
    console.error('Error fetching juz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch juz'
    });
  }
};

/**
 * Get ayahs by page (for mushaf page view)
 * GET /api/quran/page/:pageNumber
 */
exports.getPage = async (req, res) => {
  try {
    const { pageNumber } = req.params;
    const pageNum = parseInt(pageNumber);

    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page number. Must be between 1 and 604.'
      });
    }

    const ayahs = await Quran.find({ 'metadata.page': pageNum })
      .select('-__v -createdAt -updatedAt')
      .sort({ surah: 1, ayah: 1 })
      .lean();

    if (!ayahs || ayahs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Page ${pageNum} not found`
      });
    }

    res.status(200).json({
      success: true,
      page: pageNum,
      count: ayahs.length,
      data: ayahs
    });
  } catch (error) {
    console.error('Error fetching page:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page'
    });
  }
};

/**
 * Get database statistics
 * GET /api/quran/stats
 */
exports.getStats = async (req, res) => {
  try {
    const totalAyahs = await Quran.countDocuments();
    const totalSurahs = await SurahMetadata.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalAyahs,
        totalSurahs,
        expectedAyahs: 6236,
        expectedSurahs: 114,
        isComplete: totalAyahs === 6236 && totalSurahs === 114
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
