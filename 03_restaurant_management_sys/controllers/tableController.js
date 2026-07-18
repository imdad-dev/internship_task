const Table = require("../models/Table");

exports.getAllTables = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const tables = await Table.find(filter).sort({ tableNumber: 1 });
    res.json({ success: true, count: tables.length, data: tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const tables = await Table.find({ status: "available" }).sort({ tableNumber: 1 });
    res.json({ success: true, count: tables.length, data: tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!table) return res.status(404).json({ success: false, message: "Table not found" });
    res.json({ success: true, data: table });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!table) return res.status(404).json({ success: false, message: "Table not found" });
    res.json({ success: true, data: table });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: "Table not found" });
    res.json({ success: true, message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
