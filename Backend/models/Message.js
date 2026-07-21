const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // Customer's WhatsApp number (Required)
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    replyText: { type: String },
    replyDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
