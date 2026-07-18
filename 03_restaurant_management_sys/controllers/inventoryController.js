const Inventory = require("../models/Inventory");

exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ itemName: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    const lowStock = items.filter((i) => i.quantity <= i.thresholdLevel);
    res.json({ success: true, count: lowStock.length, data: lowStock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Manual stock adjustment (restock or correction)
exports.adjustStock = async (req, res) => {
  try {
    const { adjustment } = req.body; // positive or negative number
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });

    item.quantity = Math.max(0, item.quantity + Number(adjustment));
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });
    res.json({ success: true, message: "Inventory item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
