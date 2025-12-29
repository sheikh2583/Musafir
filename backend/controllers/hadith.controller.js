const fs = require('fs');
const path = require('path');

/**
 * Hadith Controller
 * 
 * Handles all Hadith-related requests for Sihah Sittah.
 * All data served from local JSON files - NO database or external APIs.
 * Optimized for offline-first operation.
 */

// Path to hadith JSON files
const HADITH_BASE_PATH = path.join(__dirname, '../../hadith-json/db/by_chapter/the_9_books');

// Collection metadata
const COLLECTIONS_META = {
  bukhari: {
    id: 'bukhari',
    name: 'Sahih Bukhari',
    nameArabic: 'صحيح البخاري',
    compiler: 'Imam Muhammad ibn Ismail al-Bukhari',
    totalChapters: 97
  },
  muslim: {
    id: 'muslim',
    name: 'Sahih Muslim',
    nameArabic: 'صحيح مسلم',
    compiler: 'Imam Muslim ibn al-Hajjaj',
    totalChapters: 56
  },
  abudawud: {
    id: 'abudawud',
    name: 'Sunan Abu Dawood',
    nameArabic: 'سنن أبي داود',
    compiler: 'Imam Abu Dawood as-Sijistani',
    totalChapters: 43
  },
  tirmidhi: {
    id: 'tirmidhi',
    name: 'Jami` at-Tirmidhi',
    nameArabic: 'جامع الترمذي',
    compiler: 'Imam Muhammad ibn Isa at-Tirmidhi',
    totalChapters: 46
  },
  nasai: {
    id: 'nasai',
    name: 'Sunan an-Nasa\'i',
    nameArabic: 'سنن النسائي',
    compiler: 'Imam Ahmad ibn Shu\'ayb an-Nasa\'i',
    totalChapters: 51
  },
  ibnmajah: {
    id: 'ibnmajah',
    name: 'Sunan Ibn Majah',
    nameArabic: 'سنن ابن ماجه',
    compiler: 'Imam Muhammad ibn Yazid ibn Majah',
    totalChapters: 37
  }
};

/**
 * Helper: Load chapter JSON file
 */
function loadChapterFile(collection, chapterNumber) {
  const filePath = path.join(HADITH_BASE_PATH, collection, `${chapterNumber}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

/**
 * Helper: Get list of chapter files for a collection
 */
function getChapterFiles(collection) {
  const collectionPath = path.join(HADITH_BASE_PATH, collection);
  if (!fs.existsSync(collectionPath)) {
    return [];
  }
  const files = fs.readdirSync(collectionPath);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => parseInt(file.replace('.json', '')))
    .sort((a, b) => a - b);
}

/**
 * Get list of available collections
 * GET /api/hadith/collections
 */
exports.getCollections = async (req, res) => {
  try {
    const collections = Object.values(COLLECTIONS_META);

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
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
 * Get chapters/books structure for a collection
 * GET /api/hadith/:collection/chapters
 */
exports.getChapters = async (req, res) => {
  try {
    const { collection } = req.params;

    if (!COLLECTIONS_META[collection]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + Object.keys(COLLECTIONS_META).join(', ')
      });
    }

    const chapterNumbers = getChapterFiles(collection);
    const chapters = chapterNumbers.map(num => {
      const data = loadChapterFile(collection, num);
      return {
        chapterNumber: num,
        chapterId: data?.chapter?.id || num,
        arabicTitle: data?.chapter?.arabic || data?.metadata?.arabic?.introduction || '',
        englishTitle: data?.chapter?.english || data?.metadata?.english?.introduction || '',
        hadithCount: data?.hadiths?.length || 0
      };
    });

    res.status(200).json({
      success: true,
      collection,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    console.error('Error fetching chapters:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapters'
    });
  }
};

/**
 * Get all hadiths from a specific chapter
 * GET /api/hadith/:collection/chapter/:chapterNumber
 */
exports.getChapter = async (req, res) => {
  try {
    const { collection, chapterNumber } = req.params;
    const chapterNum = parseInt(chapterNumber);

    if (!COLLECTIONS_META[collection]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + Object.keys(COLLECTIONS_META).join(', ')
      });
    }

    if (isNaN(chapterNum) || chapterNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chapter number.'
      });
    }

    const data = loadChapterFile(collection, chapterNum);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Chapter ${chapterNum} not found in ${collection}`
      });
    }

    // Transform hadiths to match frontend expectations
    const transformedHadiths = data.hadiths ? data.hadiths.map(hadith => {
      const uniqueHadithNumber = (chapterNum * 10000) + (hadith.idInBook || hadith.id);
      return {
        ...hadith,
        collection: collection,
        hadithNumber: uniqueHadithNumber,
        arabicText: hadith.arabic,
        translationEn: hadith.english?.text || hadith.english?.narrator,
        metadata: {
          narrator: hadith.english?.narrator,
          reference: `${COLLECTIONS_META[collection].name} ${hadith.idInBook || hadith.id}`,
          chapterId: hadith.chapterId,
          bookId: hadith.bookId
        }
      };
    }) : [];

    res.status(200).json({
      success: true,
      collection,
      chapterNumber: chapterNum,
      metadata: data.metadata,
      chapter: data.chapter,
      hadithCount: transformedHadiths.length,
      data: transformedHadiths
    });
  } catch (error) {
    console.error('Error fetching chapter:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapter'
    });
  }
};

/**
 * Get a specific hadith by collection and hadith ID
 * GET /api/hadith/:collection/hadith/:hadithId
 */
exports.getHadith = async (req, res) => {
  try {
    const { collection, hadithId } = req.params;
    const id = parseInt(hadithId);

    if (!COLLECTIONS_META[collection]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + Object.keys(COLLECTIONS_META).join(', ')
      });
    }

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hadith ID.'
      });
    }

    // Search through all chapters to find the hadith
    const chapterNumbers = getChapterFiles(collection);
    
    for (const chapterNum of chapterNumbers) {
      const data = loadChapterFile(collection, chapterNum);
      if (data && data.hadiths) {
        const hadith = data.hadiths.find(h => h.id === id || h.idInBook === id);
        if (hadith) {
          // Transform hadith to match frontend expectations
          const uniqueHadithNumber = (chapterNum * 10000) + (hadith.idInBook || hadith.id);
          const transformedHadith = {
            ...hadith,
            collection: collection,
            hadithNumber: uniqueHadithNumber,
            arabicText: hadith.arabic,
            translationEn: hadith.english?.text || hadith.english?.narrator,
            metadata: {
              narrator: hadith.english?.narrator,
              reference: `${COLLECTIONS_META[collection].name} ${hadith.idInBook || hadith.id}`,
              chapterId: hadith.chapterId,
              bookId: hadith.bookId
            }
          };
          return res.status(200).json({
            success: true,
            collection,
            chapterNumber: chapterNum,
            chapter: data.chapter,
            data: transformedHadith
          });
        }
      }
    }

    res.status(404).json({
      success: false,
      message: `Hadith #${id} not found in ${collection}`
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
 * Search hadiths by text
 * GET /api/hadith/:collection/search
 * Query params: q (search query), lang (arabic/english)
 */
exports.searchHadith = async (req, res) => {
  try {
    const { collection } = req.params;
    const { q, lang = 'english' } = req.query;

    if (!COLLECTIONS_META[collection]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid collection. Must be one of: ' + Object.keys(COLLECTIONS_META).join(', ')
      });
    }

    if (!q || q.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 3 characters long.'
      });
    }

    const searchTerm = q.toLowerCase();
    const results = [];
    const chapterNumbers = getChapterFiles(collection);

    for (const chapterNum of chapterNumbers) {
      const data = loadChapterFile(collection, chapterNum);
      if (data && data.hadiths) {
        for (const hadith of data.hadiths) {
          const textToSearch = lang === 'arabic' 
            ? hadith.arabic 
            : (hadith.english?.text || '');
          
          if (textToSearch.toLowerCase().includes(searchTerm)) {
            // Transform hadith to match frontend expectations
            const uniqueHadithNumber = (chapterNum * 10000) + (hadith.idInBook || hadith.id);
            results.push({
              ...hadith,
              collection: collection,
              hadithNumber: uniqueHadithNumber,
              arabicText: hadith.arabic,
              translationEn: hadith.english?.text || hadith.english?.narrator,
              chapterNumber: chapterNum,
              chapterTitle: data.chapter?.english || '',
              metadata: {
                narrator: hadith.english?.narrator,
                reference: `${COLLECTIONS_META[collection].name} ${hadith.idInBook || hadith.id}`,
                chapterId: hadith.chapterId,
                bookId: hadith.bookId
              }
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      collection,
      query: q,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching hadith:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search hadith'
    });
  }
};

/**
 * Get all hadiths from a collection (with pagination)
 * GET /api/hadith/:collection
 */
exports.getCollectionHadith = async (req, res) => {
  try {
    const { collection } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const bookNumber = req.query.bookNumber ? parseInt(req.query.bookNumber) : null;

    if (!COLLECTIONS_META[collection]) {
      return res.status(404).json({
        success: false,
        message: `Collection '${collection}' not found`
      });
    }

    // Get all chapters
    const chapterNumbers = getChapterFiles(collection);
    let allHadiths = [];

    // Load hadiths from all chapters and transform for frontend
    for (const chapterNum of chapterNumbers) {
      if (bookNumber && chapterNum !== bookNumber) continue;
      
      const data = loadChapterFile(collection, chapterNum);
      if (data && data.hadiths) {
        // Transform each hadith to match frontend expectations
        const transformedHadiths = data.hadiths.map(hadith => {
          // Create globally unique hadith number using chapter-based formula
          const uniqueHadithNumber = (chapterNum * 10000) + (hadith.idInBook || hadith.id);
          return {
            ...hadith,
            collection: collection,
            hadithNumber: uniqueHadithNumber,
            arabicText: hadith.arabic,
            translationEn: hadith.english?.text || hadith.english?.narrator,
            metadata: {
              narrator: hadith.english?.narrator,
              reference: `${COLLECTIONS_META[collection].name} ${hadith.idInBook || hadith.id}`,
              chapterId: hadith.chapterId,
              bookId: hadith.bookId
            }
          };
        });
        allHadiths = allHadiths.concat(transformedHadiths);
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHadiths = allHadiths.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      collection,
      page,
      limit,
      totalHadiths: allHadiths.length,
      totalPages: Math.ceil(allHadiths.length / limit),
      data: paginatedHadiths
    });
  } catch (error) {
    console.error('Error fetching collection hadith:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection hadith'
    });
  }
};

/**
 * Get specific hadith by collection and hadith number
 * GET /api/hadith/:collection/:hadithNumber
 */
exports.getHadithByNumber = async (req, res) => {
  try {
    const { collection, hadithNumber } = req.params;
    const hadithNum = parseInt(hadithNumber);

    if (!COLLECTIONS_META[collection]) {
      return res.status(404).json({
        success: false,
        message: `Collection '${collection}' not found`
      });
    }

    if (isNaN(hadithNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hadith number'
      });
    }

    // Search through all chapters
    const chapterNumbers = getChapterFiles(collection);
    for (const chapterNum of chapterNumbers) {
      const data = loadChapterFile(collection, chapterNum);
      if (data && data.hadiths) {
        const hadith = data.hadiths.find(h => h.id === hadithNum || h.idInBook === hadithNum);
        if (hadith) {
          // Transform hadith to match frontend expectations
          const uniqueHadithNumber = (chapterNum * 10000) + (hadith.idInBook || hadith.id);
          const transformedHadith = {
            ...hadith,
            collection: collection,
            hadithNumber: uniqueHadithNumber,
            arabicText: hadith.arabic,
            translationEn: hadith.english?.text || hadith.english?.narrator,
            metadata: {
              narrator: hadith.english?.narrator,
              reference: `${COLLECTIONS_META[collection].name} ${hadith.idInBook || hadith.id}`,
              chapterId: hadith.chapterId,
              bookId: hadith.bookId
            }
          };
          return res.status(200).json({
            success: true,
            collection,
            hadithNumber: hadithNum,
            data: transformedHadith
          });
        }
      }
    }

    res.status(404).json({
      success: false,
      message: `Hadith #${hadithNum} not found in ${collection}`
    });
  } catch (error) {
    console.error('Error fetching hadith by number:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hadith'
    });
  }
};

/**
 * Get books/chapters list for a collection
 * GET /api/hadith/:collection/books
 */
exports.getBooks = async (req, res) => {
  try {
    const { collection } = req.params;

    if (!COLLECTIONS_META[collection]) {
      return res.status(404).json({
        success: false,
        message: `Collection '${collection}' not found`
      });
    }

    const chapterNumbers = getChapterFiles(collection);
    const books = [];

    for (const chapterNum of chapterNumbers) {
      const data = loadChapterFile(collection, chapterNum);
      if (data && data.metadata) {
        books.push({
          bookNumber: chapterNum,
          chapterNumber: chapterNum,
          ...data.metadata,
          hadithCount: data.hadiths ? data.hadiths.length : 0
        });
      }
    }

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
    const collections = Object.keys(COLLECTIONS_META);
    
    const stats = collections.map(collection => {
      const chapterNumbers = getChapterFiles(collection);
      let totalHadiths = 0;
      
      chapterNumbers.forEach(chapterNum => {
        const data = loadChapterFile(collection, chapterNum);
        if (data && data.hadiths) {
          totalHadiths += data.hadiths.length;
        }
      });

      return {
        collection,
        chapters: chapterNumbers.length,
        hadiths: totalHadiths
      };
    });

    const total = stats.reduce((sum, stat) => sum + stat.hadiths, 0);

    res.status(200).json({
      success: true,
      data: {
        totalHadiths: total,
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
