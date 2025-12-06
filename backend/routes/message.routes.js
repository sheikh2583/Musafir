const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createMessage);
router.get('/', protect, getAllMessages);

module.exports = router;
