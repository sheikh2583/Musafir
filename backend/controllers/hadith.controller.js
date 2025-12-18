const Hadith = require('../models/Hadith.model');

/**
 * Hadith Controller
 * 
 * Handles all Hadith-related requests for Sihah Sittah.
 * All data served from local MongoDB - NO external APIs.
 * Optimized for offline-first operation.
 */

/**
 * Get list of available collections
 * GET /api/hadith/collections
 */
exports.getCollections = async (req, res) => {
  try {
    const collections = [
      {
        id: 'bukhari',
        name: 'Sahih Bukhari',
        nameArabic: 'صحيح البخاري',
        compiler: 'Imam Muhammad ibn Ismail al-Bukhari',
        totalHadith: 7563
      },
      {
        id: 'muslim',
        name: 'Sahih Muslim',
        nameArabic: 'صحيح مسلم',
        compiler: 'Imam Muslim ibn al-Hajjaj',
        totalHadith: 7563
      },
      {
        id: 'abudawud',
        name: 'Sunan Abu Dawood',
        nameArabic: 'سنن أبي داود',
        compiler: 'Imam Abu Dawood as-Sijistani',
        totalHadith: 5274
      },
      {
        id: 'tirmidhi',
        name: 'Jami` at-Tirmidhi',
        nameArabic: 'جامع الترمذي',
        compiler: 'Imam Muhammad ibn Isa at-Tirmidhi',
        totalHadith: 3956
      },
      {
        id: 'nasai',
        name: 'Sunan an-Nasa\'i',
        nameArabic: 'سنن النسائي',
        compiler: 'Imam Ahmad ibn Shu\'ayb an-Nasa\'i',
        totalHadith: 5758
      },
      {
        id: 'ibnmajah',
        name: 'Sunan Ibn Majah',
        nameArabic: 'سنن ابن ماجه',
        compiler: 'Imam Muhammad ibn Yazid ibn Majah',
        totalHadith: 4341
      }
    ];

    // Get actual counts from database
    const collectionsWithCounts = await Promise.all(
      collections.map(async (col) => {
        const count = await Hadith.countDocuments({ collection: col.id });
        return { ...col, actualCount: count };
      })
    );

    res.status(200).json({
      success: true,
      count: collectionsWithCounts.length,
      data: collectionsWithCounts
    });
  } catch (error) {
    console.error('Error fetching collections:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hadith collections'
    });
  }
};

/**
 * Get all hadith from a specific collection
 * GET /api/hadith/:collection
 * Query params: page, limit, bookNumber
 */
exports.getCollectionHadith = async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 20, bookNumber } = req.query;

    const validCollections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];
    if (!validCollections.includes(collection)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + validCollections.join(', ')
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { collection };
    if (bookNumber) {
      query.bookNumber = parseInt(bookNumber);
    }

    const [hadithList, total] = await Promise.all([
      Hadith.find(query)
        .select('-__v -createdAt -updatedAt')
        .sort({ hadithNumber: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Hadith.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      collection,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: hadithList
    });
  } catch (error) {
    console.error('Error fetching collection hadith:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hadith'
    });
  }
};

/**
 * Get a specific hadith by collection and hadith number
 * GET /api/hadith/:collection/:hadithNumber
 */
exports.getHadith = async (req, res) => {
  try {
    const { collection, hadithNumber } = req.params;
    const hadithNum = parseInt(hadithNumber);

    const validCollections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];
    if (!validCollections.includes(collection)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + validCollections.join(', ')
      });
    }

    if (isNaN(hadithNum) || hadithNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hadith number.'
      });
    }

    const hadith = await Hadith.findOne({
      collection,
      hadithNumber: hadithNum
    })
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!hadith) {
      return res.status(404).json({
        success: false,
        message: `Hadith ${collection} #${hadithNum} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: hadith
    });
  } catch (error) {
    console.error('Error fetching hadith:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hadith'
    });
  }
};

/**
 * Get books/chapters structure for a collection
 * GET /api/hadith/:collection/books
 */
exports.getBooks = async (req, res) => {
  try {
    const { collection } = req.params;

    const validCollections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];
    if (!validCollections.includes(collection)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + validCollections.join(', ')
      });
    }

    // Get unique book numbers and names
    const books = await Hadith.aggregate([
      { $match: { collection } },
      {
        $group: {
          _id: '$bookNumber',
          bookName: { $first: '$bookName' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          bookNumber: '$_id',
          bookName: 1,
          hadithCount: '$count'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      collection,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books'
    });
  }
};

/**
 * Get database statistics
 * GET /api/hadith/stats
 */
exports.getStats = async (req, res) => {
  try {
    const collections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];
    
    const stats = await Promise.all(
      collections.map(async (col) => {
        const count = await Hadith.countDocuments({ collection: col });
        return { collection: col, count };
      })
    );

    const total = stats.reduce((sum, stat) => sum + stat.count, 0);

    res.status(200).json({
      success: true,
      data: {
        total,
        byCollection: stats
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
