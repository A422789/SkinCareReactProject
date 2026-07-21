const Settings = require('../models/Settings');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
const translate = require('../utils/translate');

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
      const nameEn = name.en || '';
      const nameAr = name.ar && name.ar.trim() ? name.ar : await translate(nameEn);
      settings.name = { en: nameEn, ar: nameAr };
    }
    if (contact) settings.contact = contact;
    if (about) {
      const sec1TitleEn = about.sec1Title?.en || '';
      const sec1TitleAr = about.sec1Title?.ar && about.sec1Title.ar.trim() ? about.sec1Title.ar : await translate(sec1TitleEn);

      const sec1SubtitleEn = about.sec1Subtitle?.en || '';
      const sec1SubtitleAr = about.sec1Subtitle?.ar && about.sec1Subtitle.ar.trim() ? about.sec1Subtitle.ar : await translate(sec1SubtitleEn);

      const sec2TitleEn = about.sec2Title?.en || '';
      const sec2TitleAr = about.sec2Title?.ar && about.sec2Title.ar.trim() ? about.sec2Title.ar : await translate(sec2TitleEn);

      const sec2SubtitleEn = about.sec2Subtitle?.en || '';
      const sec2SubtitleAr = about.sec2Subtitle?.ar && about.sec2Subtitle.ar.trim() ? about.sec2Subtitle.ar : await translate(sec2SubtitleEn);

      const sec3TitleEn = about.sec3Title?.en || '';
      const sec3TitleAr = about.sec3Title?.ar && about.sec3Title.ar.trim() ? about.sec3Title.ar : await translate(sec3TitleEn);

      const sec3SubtitleEn = about.sec3Subtitle?.en || '';
      const sec3SubtitleAr = about.sec3Subtitle?.ar && about.sec3Subtitle.ar.trim() ? about.sec3Subtitle.ar : await translate(sec3SubtitleEn);

      settings.about = {
        ...settings.about,
        sec1Title: { en: sec1TitleEn, ar: sec1TitleAr },
        sec1Subtitle: { en: sec1SubtitleEn, ar: sec1SubtitleAr },
        sec2Title: { en: sec2TitleEn, ar: sec2TitleAr },
        sec2Subtitle: { en: sec2SubtitleEn, ar: sec2SubtitleAr },
        sec3Title: { en: sec3TitleEn, ar: sec3TitleAr },
        sec3Subtitle: { en: sec3SubtitleEn, ar: sec3SubtitleAr },
      };
    }
    if (hero) {
      const titleEn = hero.title?.en || '';
      const titleAr = hero.title?.ar && hero.title.ar.trim() ? hero.title.ar : await translate(titleEn);

      const subtitleEn = hero.subtitle?.en || '';
      const subtitleAr = hero.subtitle?.ar && hero.subtitle.ar.trim() ? hero.subtitle.ar : await translate(subtitleEn);

      settings.hero = {
        ...settings.hero,
        title: { en: titleEn, ar: titleAr },
        subtitle: { en: subtitleEn, ar: subtitleAr },
      };
    }

    if (testimonials) {
      settings.testimonials = testimonials;
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
