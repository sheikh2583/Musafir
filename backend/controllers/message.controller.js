const Message = require('../models/Message.model');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = await Message.create({
      user: req.user._id,
      content: content.trim(),
    });

    // Populate user information
    await message.populate('user', 'name email');

    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
