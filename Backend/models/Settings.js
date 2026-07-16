const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String },
    },
    logoUrl: { type: String },
    contact: {
      email: { type: String },
      phone: { type: String },
      whatsapp: { type: String },
      instagram: { type: String },
      location: { type: String },
    },
    about: {
      sec1Title: {
        en: { type: String },
        ar: { type: String },
      },
      sec1Subtitle: {
        en: { type: String },
        ar: { type: String },
      },
      sec2Title: {
        en: { type: String },
        ar: { type: String },
      },
      sec2Subtitle: {
        en: { type: String },
        ar: { type: String },
      },
      sec2ImageUrl: { type: String },
      sec3Title: {
        en: { type: String },
        ar: { type: String },
      },
      sec3Subtitle: {
        en: { type: String },
        ar: { type: String },
      },
      sec3ImageUrl: { type: String },
    },
    hero: {
      title: {
        en: { type: String },
        ar: { type: String },
      },
      subtitle: {
        en: { type: String },
        ar: { type: String },
      },
      leftBottleUrl: { type: String },
      rightBottleUrl: { type: String },
    },
    testimonials: [
      {
        id: { type: Number, required: true },
        type: {
          type: String,
          enum: ['text', 'screenshot'],
          default: 'text',
        },
        author: { type: String },
        quote: { type: String },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        screenshotUrl: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
