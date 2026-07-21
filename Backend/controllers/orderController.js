const Order = require('../models/Order');
const Product = require('../models/Product');
const PaymentType = require('../models/PaymentType');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

// Helper to generate a unique orderId (e.g., HE-123456)
const generateUniqueOrderId = async () => {
  let isUnique = false;
  let orderId = '';
  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    orderId = `ORD-${randomNum}`;
    const existing = await Order.findOne({ orderId });
    if (!existing) {
      isUnique = true;
    }
  }
  return orderId;
};

// @desc    Create a new order (Public checkout)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { customer, orderItems, paymentType } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city) {
      throw new BadRequestError('Customer details (name, phone, address, city) are required');
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new BadRequestError('Order items are required');
    }

    if (!paymentType) {
      throw new BadRequestError('Payment type is required');
    }

    // Verify Payment Type exists and is active
    const selectedPayment = await PaymentType.findById(paymentType);
    if (!selectedPayment || !selectedPayment.isActive) {
      throw new BadRequestError('Invalid or inactive payment type selected');
    }

    let calculatedTotalPrice = 0;
    const itemsToSave = [];
    const itemDetailsForNotification = [];

    // Validate and fetch price/stock for each product
    for (const item of orderItems) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        throw new BadRequestError('Each item must have a valid product reference and quantity');
      }

      const product = await Product.findById(item.product);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.product}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for product: ${product.name.en}. Available: ${product.stock}`);
      }

      // Decrement product stock
      product.stock -= item.quantity;
      await product.save();

      // Use the actual DB price of the product (handle offerPrice if exists)
      const currentPrice = product.hasOffer && product.offerPrice ? product.offerPrice : product.price;
      calculatedTotalPrice += currentPrice * item.quantity;

      itemsToSave.push({
        product: product._id,
        quantity: item.quantity,
        price: currentPrice,
      });

      // Save name for notification template
      itemDetailsForNotification.push({
        name: product.name.ar || product.name.en || 'منتج',
        quantity: item.quantity,
        price: currentPrice
      });
    }

    const orderId = await generateUniqueOrderId();

    const order = new Order({
      orderId,
      customer,
      orderItems: itemsToSave,
      paymentType: selectedPayment._id,
      totalPrice: calculatedTotalPrice,
    });

    const createdOrder = await order.save();

    // Send WhatsApp notification to Admin (non-blocking)
    const adminWhatsApp = process.env.ADMIN_WHATSAPP;
    if (adminWhatsApp) {
      const itemsList = itemDetailsForNotification
        .map(item => `- ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ج.م`)
        .join('\n');

      const whatsappMessage = `🛍️ *طلب جديد رقم ${orderId}*

👤 *العميل:* ${customer.name}
📞 *الهاتف:* ${customer.phone}
📍 *العنوان:* ${customer.city}، ${customer.address}

📦 *المنتجات:*
${itemsList}

💰 *الإجمالي:* ${calculatedTotalPrice} ج.م
💳 *طريقة الدفع:* ${selectedPayment.name}`;

      sendWhatsAppMessage(adminWhatsApp, whatsappMessage).catch(err => {
        console.error('Failed to send order notification via WhatsApp:', err.message);
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('orderItems.product', 'name price image tagline ingredients howToUse')
      .populate('paymentType', 'name id');
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name price image tagline ingredients howToUse')
      .populate('paymentType', 'name id');

    if (!order) {
      throw new NotFoundError('Order not found');
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res, next) => {
  try {
    const { status, paymentType } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        throw new BadRequestError('Please provide a valid order status');
      }

      // Handle stock restoration if order is cancelled
      if (status === 'Cancelled' && order.status !== 'Cancelled') {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
      }
      // Handle stock re-deduction if order is un-cancelled (e.g. moved back to Pending)
      else if (order.status === 'Cancelled' && status !== 'Cancelled') {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            if (product.stock < item.quantity) {
              throw new BadRequestError(`Cannot restore order status. Insufficient stock for product: ${product.name.en}`);
            }
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }
      order.status = status;
    }

    if (paymentType) {
      const selectedPayment = await PaymentType.findById(paymentType);
      if (!selectedPayment || !selectedPayment.isActive) {
        throw new BadRequestError('Invalid or inactive payment type selected');
      }
      order.paymentType = selectedPayment._id;
    }

    const updatedOrder = await order.save();

    // Populate for response
    const populated = await Order.findById(updatedOrder._id)
      .populate('orderItems.product', 'name price image tagline ingredients howToUse')
      .populate('paymentType', 'name id');

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order by ID
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // If deleting an order that isn't cancelled, restore stock first (optional, but standard practice)
    if (order.status !== 'Cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await order.deleteOne();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
