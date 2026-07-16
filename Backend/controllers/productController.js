const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      category,
      price,
      stock,
      description,
      ingredients,
      howToUse,
      isNewArrival,
      isBestSeller,
      hasOffer,
      offerPrice,
    } = req.body;

    // Check if name is provided (name.en is required)
    if (!name || !name.en || !category || !price) {
      throw new BadRequestError('Product name (EN), category, and price are required');
    }

    let imageUrl = '';
    if (req.file) {
      // Upload image buffer to Cloudinary
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = new Product({
      name,
      tagline,
      category,
      price,
      stock,
      description,
      ingredients,
      howToUse,
      image: imageUrl,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
      hasOffer: hasOffer === 'true' || hasOffer === true,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const {
      name,
      tagline,
      category,
      price,
      stock,
      description,
      ingredients,
      howToUse,
      isNewArrival,
      isBestSeller,
      hasOffer,
      offerPrice,
    } = req.body;

    // Update basic fields if they exist
    if (name) product.name = name;
    if (tagline) product.tagline = tagline;
    if (category) product.category = category;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;
    if (ingredients) product.ingredients = ingredients;
    if (howToUse) product.howToUse = howToUse;
    
    if (isNewArrival !== undefined) {
      product.isNewArrival = isNewArrival === 'true' || isNewArrival === true;
    }
    if (isBestSeller !== undefined) {
      product.isBestSeller = isBestSeller === 'true' || isBestSeller === true;
    }
    if (hasOffer !== undefined) {
      product.hasOffer = hasOffer === 'true' || hasOffer === true;
    }
    if (offerPrice !== undefined) {
      product.offerPrice = offerPrice ? Number(offerPrice) : undefined;
    }

    // Check if new image is uploaded
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      product.image = imageUrl;
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
