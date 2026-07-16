const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    userAgent: { type: String },
    date: { type: String, required: true } // Format: YYYY-MM-DD to check unique visits per day
  },
  {
    timestamps: true
  }
);

// Compounding unique index to prevent double counting same user on the same day
visitSchema.index({ ip: 1, date: 1 }, { unique: true });

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
