const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// TTL index: automatically delete documents 12 hours after creation
blacklistedTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 12 * 60 * 60 });

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

module.exports = BlacklistedToken;
