const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String },
    },
    tagline: {
      en: { type: String },
      ar: { type: String },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    ingredients: {
      en: { type: String },
      ar: { type: String },
    },
    howToUse: {
      en: { type: String },
      ar: { type: String },
    },
    image: {
      type: String,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    hasOffer: {
      type: Boolean,
      default: false,
    },
    offerPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
