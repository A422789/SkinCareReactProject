const Message = require('../models/Message');
const Order = require('../models/Order');

// @desc    Get latest dashboard notifications (unread messages & pending/unread orders)
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res, next) => {
  try {
    // 1. Fetch unread customer messages
    const unreadMessagesCount = await Message.countDocuments({ read: false });
    const latestMessages = await Message.find({ read: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subject createdAt');

    // 2. Fetch pending/processing orders as notifications
    const pendingOrdersCount = await Order.countDocuments({ status: 'Pending' });
    const latestOrders = await Order.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId customer totalPrice createdAt');

    // 3. Format alerts list for the UI
    const alerts = [];
    
    latestOrders.forEach(order => {
      alerts.push({
        id: `order-${order._id}`,
        type: 'order',
        message: `New order #${order.orderId} received from ${order.customer.name}`,
        time: order.createdAt,
        read: false
      });
    });

    latestMessages.forEach(msg => {
      alerts.push({
        id: `message-${msg._id}`,
        type: 'message',
        message: `New message from ${msg.name}: ${msg.subject}`,
        time: msg.createdAt,
        read: false
      });
    });

    // Sort combined alerts by time descending
    alerts.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      unreadMessagesCount,
      pendingOrdersCount,
      totalNotificationCount: unreadMessagesCount + pendingOrdersCount,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications
};
