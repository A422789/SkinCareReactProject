const PaymentType = require('../models/PaymentType');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');

// @desc    Get all payment types
// @route   GET /api/payment-types
// @access  Public
const getPaymentTypes = async (req, res, next) => {
  try {
    const paymentTypes = await PaymentType.find({});
    res.status(200).json(paymentTypes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment type by ID
// @route   GET /api/payment-types/:id
// @access  Public
const getPaymentTypeById = async (req, res, next) => {
  try {
    const paymentType = await PaymentType.findById(req.params.id);
    if (!paymentType) {
      throw new NotFoundError('Payment Type not found');
    }
    res.status(200).json(paymentType);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new payment type
// @route   POST /api/payment-types
// @access  Private/Admin
const createPaymentType = async (req, res, next) => {
  try {
    const { id, name, isActive } = req.body;

    if (!id || !name) {
      throw new BadRequestError('Payment Type id and name are required');
    }

    // Check if id or name already exists
    const paymentTypeExists = await PaymentType.findOne({ $or: [{ id }, { name }] });
    if (paymentTypeExists) {
      throw new BadRequestError('Payment Type id or name already exists');
    }

    const paymentType = new PaymentType({
      id,
      name,
      isActive: isActive !== undefined ? isActive : true,
    });
    const createdPaymentType = await paymentType.save();

    res.status(201).json(createdPaymentType);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a payment type by ID
// @route   PUT /api/payment-types/:id
// @access  Private/Admin
const updatePaymentType = async (req, res, next) => {
  try {
    const { id, name, isActive } = req.body;

    if (!id || !name) {
      throw new BadRequestError('Payment Type id and name are required for update');
    }

    const paymentType = await PaymentType.findById(req.params.id);
    if (!paymentType) {
      throw new NotFoundError('Payment Type not found');
    }

    // Check if new id or name already exists for another payment type
    const paymentTypeExists = await PaymentType.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ id }, { name }] }
      ]
    });
    if (paymentTypeExists) {
      throw new BadRequestError('Payment Type id or name already exists');
    }

    paymentType.id = id;
    paymentType.name = name;
    if (isActive !== undefined) {
      paymentType.isActive = isActive;
    }

    const updatedPaymentType = await paymentType.save();
    res.status(200).json(updatedPaymentType);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a payment type by ID
// @route   DELETE /api/payment-types/:id
// @access  Private/Admin
const deletePaymentType = async (req, res, next) => {
  try {
    const paymentType = await PaymentType.findById(req.params.id);
    if (!paymentType) {
      throw new NotFoundError('Payment Type not found');
    }

    await paymentType.deleteOne();
    res.status(200).json({ message: 'Payment Type removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentTypes,
  getPaymentTypeById,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
};
