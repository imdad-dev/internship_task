const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");
const Order = require("../models/Order");

exports.renderHome = async (req, res) => {
  const featured = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(6);
  res.render("index", { title: "Savora | Fine Dining Experience", featured });
};

exports.renderMenuPage = async (req, res) => {
  const items = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });
  const categories = ["Starter", "Main Course", "Dessert", "Beverage", "Combo"];
  res.render("menu", { title: "Our Menu | Savora", items, categories });
};

exports.renderReservePage = async (req, res) => {
  const tables = await Table.find({ status: "available" }).sort({ tableNumber: 1 });
  res.render("reserve", { title: "Reserve a Table | Savora", tables });
};

exports.renderOrderSuccess = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("table", "tableNumber");
  if (!order) return res.redirect("/menu");
  res.render("order-success", { title: "Order Confirmed | Savora", order });
};

exports.renderAbout = (req, res) => {
  res.render("about", { title: "About Us | Savora" });
};
