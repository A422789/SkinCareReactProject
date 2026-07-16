const Order = require('../models/Order');
const Visit = require('../models/Visit');

// @desc    Get dashboard analytics overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getOverview = async (req, res, next) => {
  try {
    // 1. Calculate Total Revenue from all successful orders
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // 2. Count Total Orders
    const totalOrders = await Order.countDocuments({});

    // 3. Count Total Unique Visits
    const totalVisits = await Visit.countDocuments({});

    // 4. Calculate Sales Data over the last 7 days dynamically from Orders
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesMap = {};
    
    // Initialize last 7 days with 0 sales
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      salesMap[dayName] = 0;
    }

    // Populate with actual sales from orders created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await Order.find({
      status: { $ne: 'Cancelled' },
      createdAt: { $gte: sevenDaysAgo }
    });

    recentOrders.forEach(order => {
      const dayName = daysOfWeek[new Date(order.createdAt).getDay()];
      if (salesMap[dayName] !== undefined) {
        salesMap[dayName] += order.totalPrice || 0;
      }
    });

    // Format salesMap back into array for frontend charts
    const salesData = Object.keys(salesMap).map(day => ({
      name: day,
      sales: salesMap[day]
    }));

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalVisits,
      salesData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a unique visitor visit
// @route   POST /api/analytics/visit
// @access  Public
const recordVisit = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Mongoose unique constraint handles duplicates
    await Visit.create({ ip, userAgent, date }).catch(() => {});

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  recordVisit
};
