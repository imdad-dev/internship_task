const MenuItem = require("../models/MenuItem");
const Inventory = require("../models/Inventory");

// GET all menu items (API - used by public menu page + admin)
exports.getAllMenuItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available === "true") filter.isAvailable = true;

    const items = await MenuItem.find(filter).populate("ingredients.inventoryItem", "itemName unit").sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("ingredients.inventoryItem", "itemName unit quantity");
    if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isVeg, isAvailable, isFeatured, ingredients } = req.body;

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image: image || undefined,
      isVeg: isVeg === "true" || isVeg === true,
      isAvailable: isAvailable === undefined ? true : isAvailable === "true" || isAvailable === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      ingredients: ingredients || [],
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// helper used elsewhere (order controller) - not a route
exports.getInventoryList = async () => Inventory.find().sort({ itemName: 1 });
