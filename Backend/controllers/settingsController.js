const Settings = require('../models/Settings');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
const { translateBilingual } = require('../utils/translate');

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
    } else if (req.body.logoUrl !== undefined) {
      settings.logoUrl = req.body.logoUrl;
    }

    // About images
    if (files.sec2Image && files.sec2Image[0]) {
      if (!settings.about) settings.about = {};
      settings.about.sec2ImageUrl = await uploadToCloudinary(files.sec2Image[0].buffer, 'settings');
    } else if (about && about.sec2ImageUrl !== undefined) {
      if (!settings.about) settings.about = {};
      settings.about.sec2ImageUrl = about.sec2ImageUrl;
    }
    if (files.sec3Image && files.sec3Image[0]) {
      if (!settings.about) settings.about = {};
      settings.about.sec3ImageUrl = await uploadToCloudinary(files.sec3Image[0].buffer, 'settings');
    } else if (about && about.sec3ImageUrl !== undefined) {
      if (!settings.about) settings.about = {};
      settings.about.sec3ImageUrl = about.sec3ImageUrl;
    }

    // Hero bottles
    if (files.leftBottle && files.leftBottle[0]) {
      if (!settings.hero) settings.hero = {};
      settings.hero.leftBottleUrl = await uploadToCloudinary(files.leftBottle[0].buffer, 'settings');
    } else if (hero && hero.leftBottleUrl !== undefined) {
      if (!settings.hero) settings.hero = {};
      settings.hero.leftBottleUrl = hero.leftBottleUrl;
    }
    if (files.rightBottle && files.rightBottle[0]) {
      if (!settings.hero) settings.hero = {};
      settings.hero.rightBottleUrl = await uploadToCloudinary(files.rightBottle[0].buffer, 'settings');
    } else if (hero && hero.rightBottleUrl !== undefined) {
      if (!settings.hero) settings.hero = {};
      settings.hero.rightBottleUrl = hero.rightBottleUrl;
    }

    // Update textual properties with translation fallbacks
    if (name) {
      settings.name = await translateBilingual(name);
    }
    if (contact) {
      const translatedLocation = await translateBilingual(contact.location);
      if (contact.email !== undefined) settings.contact.email = contact.email;
      if (contact.phone !== undefined) settings.contact.phone = contact.phone;
      if (contact.whatsapp !== undefined) settings.contact.whatsapp = contact.whatsapp;
      if (contact.instagram !== undefined) settings.contact.instagram = contact.instagram;
      settings.contact.location = translatedLocation;
    }
    if (about) {
      const [sec1Title, sec1Subtitle, sec2Title, sec2Subtitle, sec3Title, sec3Subtitle] = await Promise.all([
        translateBilingual(about.sec1Title),
        translateBilingual(about.sec1Subtitle),
        translateBilingual(about.sec2Title),
        translateBilingual(about.sec2Subtitle),
        translateBilingual(about.sec3Title),
        translateBilingual(about.sec3Subtitle),
      ]);

      settings.about = {
        ...settings.about,
        sec1Title,
        sec1Subtitle,
        sec2Title,
        sec2Subtitle,
        sec3Title,
        sec3Subtitle,
      };
    }
    if (hero) {
      const [title, subtitle] = await Promise.all([
        translateBilingual(hero.title),
        translateBilingual(hero.subtitle),
      ]);

      settings.hero = {
        ...settings.hero,
        title,
        subtitle,
      };
    }

    if (testimonials) {
      settings.testimonials = testimonials;
    }

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    logger.error(`Error updating settings: ${error.message}\nStack: ${error.stack}`);
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
