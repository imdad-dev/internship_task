const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

// Dashboard summary stats
exports.getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [todayOrders, totalTables, occupiedTables, pendingReservations, allInventory, totalOrdersAllTime] = await Promise.all([
      Order.find({ createdAt: { $gte: startOfToday, $lte: endOfToday }, status: { $ne: "cancelled" } }),
      Table.countDocuments(),
      Table.countDocuments({ status: "occupied" }),
      Reservation.countDocuments({ status: "pending" }),
      Inventory.find(),
      Order.countDocuments({ status: { $ne: "cancelled" } }),
    ]);

    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lowStockCount = allInventory.filter((i) => i.quantity <= i.thresholdLevel).length;

    res.json({
      success: true,
      data: {
        todayOrderCount: todayOrders.length,
        todaySales,
        totalTables,
        occupiedTables,
        pendingReservations,
        lowStockCount,
        totalOrdersAllTime,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Daily sales report for a given date range (defaults to last 7 days)
exports.getDailySalesReport = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $ne: "cancelled" },
    });

    const salesByDate = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      salesByDate[key] = { date: key, totalSales: 0, orderCount: 0 };
    }

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      if (salesByDate[key]) {
        salesByDate[key].totalSales += order.totalAmount;
        salesByDate[key].orderCount += 1;
      }
    });

    res.json({ success: true, data: Object.values(salesByDate) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Top selling menu items
exports.getTopSellingItems = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "cancelled" } });
    const tally = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        if (!tally[key]) tally[key] = { name: key, quantitySold: 0, revenue: 0 };
        tally[key].quantitySold += item.quantity;
        tally[key].revenue += item.price * item.quantity;
      });
    });

    const sorted = Object.values(tally).sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 10);
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStockAlerts = async (req, res) => {
  try {
    const items = await Inventory.find();
    const alerts = items.filter((i) => i.quantity <= i.thresholdLevel);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
