const Category = require('../models/Category');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      throw new BadRequestError('Category id and name are required');
    }

    // Check if category id or name already exists
    const categoryExists = await Category.findOne({ $or: [{ id }, { name }] });
    if (categoryExists) {
      throw new BadRequestError('Category id or name already exists');
    }

    const category = new Category({ id, name });
    const createdCategory = await category.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      throw new BadRequestError('Category id and name are required for update');
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if new id or name already exists for a different category
    const categoryExists = await Category.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ id }, { name }] }
      ]
    });
    if (categoryExists) {
      throw new BadRequestError('Category id or name already exists');
    }

    category.id = id;
    category.name = name;
    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
