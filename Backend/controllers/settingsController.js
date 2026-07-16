const Settings = require('../models/Settings');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    // Auto-create empty settings if none exist (singleton)
    if (!settings) {
      settings = await Settings.create({ name: { en: 'Store Name' } });
    }

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update store settings (all fields)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    // Auto-create if none exist
    if (!settings) {
      settings = await Settings.create({ name: { en: 'Store Name' } });
    }

    const { name, contact, about, hero, testimonials } = req.body;

    // Handle files upload to Cloudinary if sent
    const files = req.files || {};
    
    // Logo
    if (files.logo && files.logo[0]) {
      settings.logoUrl = await uploadToCloudinary(files.logo[0].buffer, 'settings');
    }

    // About images
    if (files.sec2Image && files.sec2Image[0]) {
      if (!settings.about) settings.about = {};
      settings.about.sec2ImageUrl = await uploadToCloudinary(files.sec2Image[0].buffer, 'settings');
    }
    if (files.sec3Image && files.sec3Image[0]) {
      if (!settings.about) settings.about = {};
      settings.about.sec3ImageUrl = await uploadToCloudinary(files.sec3Image[0].buffer, 'settings');
    }

    // Hero bottles
    if (files.leftBottle && files.leftBottle[0]) {
      if (!settings.hero) settings.hero = {};
      settings.hero.leftBottleUrl = await uploadToCloudinary(files.leftBottle[0].buffer, 'settings');
    }
    if (files.rightBottle && files.rightBottle[0]) {
      if (!settings.hero) settings.hero = {};
      settings.hero.rightBottleUrl = await uploadToCloudinary(files.rightBottle[0].buffer, 'settings');
    }

    // Update textual properties
    if (name) settings.name = name;
    if (contact) settings.contact = contact;
    if (about) {
      settings.about = {
        ...settings.about,
        sec1Title: about.sec1Title || settings.about?.sec1Title,
        sec1Subtitle: about.sec1Subtitle || settings.about?.sec1Subtitle,
        sec2Title: about.sec2Title || settings.about?.sec2Title,
        sec2Subtitle: about.sec2Subtitle || settings.about?.sec2Subtitle,
        sec3Title: about.sec3Title || settings.about?.sec3Title,
        sec3Subtitle: about.sec3Subtitle || settings.about?.sec3Subtitle,
      };
    }
    if (hero) {
      settings.hero = {
        ...settings.hero,
        title: hero.title || settings.hero?.title,
        subtitle: hero.subtitle || settings.hero?.subtitle,
      };
    }

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a testimonial
// @route   POST /api/settings/testimonials
// @access  Private/Admin
const addTestimonial = async (req, res, next) => {
  try {
    const settings = await Settings.findOne() || await Settings.create({ name: { en: 'Store Name' } });
    const { type, author, quote, rating } = req.body;

    let screenshotUrl = '';
    if (req.file) {
      screenshotUrl = await uploadToCloudinary(req.file.buffer, 'testimonials');
    }

    const nextId = settings.testimonials.length > 0 
      ? Math.max(...settings.testimonials.map(t => t.id)) + 1 
      : 1;

    const newTestimonial = {
      id: nextId,
      type: type || 'text',
      author,
      quote,
      rating: Number(rating) || 5,
      screenshotUrl,
    };

    settings.testimonials.push(newTestimonial);
    await settings.save();

    res.status(201).json(newTestimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a testimonial by testimonial id
// @route   PUT /api/settings/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      throw new NotFoundError('Settings not found');
    }

    const testimonialId = Number(req.params.id);
    const testimonialIdx = settings.testimonials.findIndex(t => t.id === testimonialId);

    if (testimonialIdx === -1) {
      throw new NotFoundError('Testimonial not found');
    }

    const { type, author, quote, rating } = req.body;

    if (type) settings.testimonials[testimonialIdx].type = type;
    if (author) settings.testimonials[testimonialIdx].author = author;
    if (quote) settings.testimonials[testimonialIdx].quote = quote;
    if (rating) settings.testimonials[testimonialIdx].rating = Number(rating);

    if (req.file) {
      settings.testimonials[testimonialIdx].screenshotUrl = await uploadToCloudinary(req.file.buffer, 'testimonials');
    }

    await settings.save();
    res.status(200).json(settings.testimonials[testimonialIdx]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a testimonial by testimonial id
// @route   DELETE /api/settings/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      throw new NotFoundError('Settings not found');
    }

    const testimonialId = Number(req.params.id);
    const originalLength = settings.testimonials.length;

    settings.testimonials = settings.testimonials.filter(t => t.id !== testimonialId);

    if (settings.testimonials.length === originalLength) {
      throw new NotFoundError('Testimonial not found');
    }

    await settings.save();
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
