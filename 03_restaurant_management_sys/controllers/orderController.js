const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");
const Inventory = require("../models/Inventory");

// Generates a human friendly order number e.g. ORD-240718-0001
const generateOrderNumber = async () => {
  const today = new Date();
  const datePart = `${today.getFullYear().toString().slice(2)}${String(today.getMonth() + 1).padStart(2, "0")}${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const countToday = await Order.countDocuments({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  });

  return `ORD-${datePart}-${String(countToday + 1).padStart(4, "0")}`;
};

// GET all orders (admin) with optional status filter
exports.getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter).populate("table", "tableNumber location").sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("table", "tableNumber location").populate("items.menuItem", "name image");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST place a new order
// Handles: table availability check + inventory sufficiency check + auto stock deduction
exports.placeOrder = async (req, res) => {
  try {
    const { customerName, phone, orderType, tableId, items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    // 1. Validate table (dine-in only)
    let table = null;
    if (orderType === "dine-in") {
      if (!tableId) return res.status(400).json({ success: false, message: "Table is required for dine-in orders" });
      table = await Table.findById(tableId);
      if (!table) return res.status(404).json({ success: false, message: "Table not found" });
      if (table.status === "occupied") {
        return res.status(400).json({ success: false, message: `Table ${table.tableNumber} is already occupied.` });
      }
    }

    // 2. Fetch menu items & build order line items with price snapshot
    const orderItems = [];
    let totalAmount = 0;
    const ingredientUsage = new Map(); // inventoryItemId -> quantity to deduct

    for (const line of items) {
      const menuItem = await MenuItem.findById(line.menuItemId).populate("ingredients.inventoryItem");
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found: ${line.menuItemId}` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `${menuItem.name} is currently unavailable` });
      }

      const qty = Number(line.quantity) || 1;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
      });
      totalAmount += menuItem.price * qty;

      // Accumulate required raw-ingredient quantities
      for (const ing of menuItem.ingredients) {
        if (!ing.inventoryItem) continue;
        const invId = ing.inventoryItem._id.toString();
        const requiredQty = ing.quantityRequired * qty;
        ingredientUsage.set(invId, (ingredientUsage.get(invId) || 0) + requiredQty);
      }
    }

    // 3. Check inventory sufficiency BEFORE committing the order
    const shortages = [];
    for (const [invId, requiredQty] of ingredientUsage.entries()) {
      const invItem = await Inventory.findById(invId);
      if (!invItem || invItem.quantity < requiredQty) {
        shortages.push({
          item: invItem ? invItem.itemName : invId,
          required: requiredQty,
          available: invItem ? invItem.quantity : 0,
        });
      }
    }
    if (shortages.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock to fulfil this order",
        shortages,
      });
    }

    // 4. Deduct inventory (auto stock update)
    for (const [invId, requiredQty] of ingredientUsage.entries()) {
      await Inventory.findByIdAndUpdate(invId, { $inc: { quantity: -requiredQty } });
    }

    // 5. Create the order
    const orderNumber = await generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customerName,
      phone,
      orderType,
      table: table ? table._id : null,
      items: orderItems,
      totalAmount,
      notes,
    });

    // 6. Mark table occupied for dine-in
    if (table) {
      table.status = "occupied";
      await table.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH update order status (admin) - frees table when completed/cancelled
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("table");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    if (order.table && (status === "completed" || status === "cancelled")) {
      order.table.status = "available";
      await order.table.save();
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
