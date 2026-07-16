const Message = require('../models/Message');
const { sendWhatsAppMessage } = require('../utils/whatsapp');
const { NotFoundError, BadRequestError, ThirdPartyIntegrationError } = require('../utils/customErrors');
const logger = require('../utils/logger');

// @desc    Submit a new contact message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      throw new BadRequestError('All fields are required (name, email, phone, subject, message)');
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    let whatsappSent = false;
    let whatsappError = null;

    // Send WhatsApp notification to admin
    try {
      const adminWhatsApp = process.env.ADMIN_WHATSAPP;
      if (adminWhatsApp) {
        const notification =
          `📩 *رسالة جديدة من الموقع*\n\n` +
          `👤 *الاسم:* ${name}\n` +
          `📧 *الإيميل:* ${email}\n` +
          `📞 *الواتساب:* ${phone || 'غير متوفر'}\n` +
          `📌 *الموضوع:* ${subject}\n` +
          `💬 *الرسالة:* ${message}`;
        const sent = await sendWhatsAppMessage(adminWhatsApp, notification);
        if (!sent) {
          throw new ThirdPartyIntegrationError('WhatsApp client is not ready or failed to send');
        }
        whatsappSent = true;
      }
    } catch (error) {
      // Create a specific integration error
      const integrationError = error instanceof ThirdPartyIntegrationError
        ? error
        : new ThirdPartyIntegrationError(`WhatsApp Notification Failed: ${error.message}`);

      logger.error(integrationError.message);
      whatsappError = integrationError.message;
    }

    res.status(201).json({
      message: newMessage,
      whatsappNotify: {
        success: whatsappSent,
        error: whatsappError
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message by ID (marks as read)
// @route   GET /api/messages/:id
// @access  Private/Admin
const getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Mark as read when admin opens it
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a message (placeholder — logic TBD)
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
const replyToMessage = async (req, res, next) => {
  try {
    const { replyText } = req.body;

    if (!replyText) {
      throw new BadRequestError('Reply text is required');
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (!message.phone) {
      throw new BadRequestError('Customer phone number is not available in this message');
    }

    const sent = await sendWhatsAppMessage(message.phone, replyText);
    if (!sent) {
      throw new ThirdPartyIntegrationError('Failed to send WhatsApp reply to customer');
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully to customer via WhatsApp',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message read status
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const { read } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    message.read = read !== undefined ? read : true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  replyToMessage,
  updateMessageStatus,
};
