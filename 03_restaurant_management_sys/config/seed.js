require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Table = require("../models/Table");
const Inventory = require("../models/Inventory");
const MenuItem = require("../models/MenuItem");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  // ---------- Admin ----------
  const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || "admin" });
  if (!existingAdmin) {
    await Admin.create({
      name: "Restaurant Admin",
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@restaurant.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "superadmin",
    });
    console.log("✅ Default admin created (see .env for credentials)");
  } else {
    console.log("ℹ️  Admin already exists, skipping");
  }

  // ---------- Tables ----------
  const tableCount = await Table.countDocuments();
  if (tableCount === 0) {
    const tables = [];
    for (let i = 1; i <= 10; i++) {
      tables.push({
        tableNumber: i,
        capacity: i % 3 === 0 ? 6 : 4,
        location: i <= 6 ? "Main Hall" : i <= 8 ? "Patio" : "Balcony",
      });
    }
    await Table.insertMany(tables);
    console.log("✅ 10 sample tables created");
  }

  // ---------- Inventory ----------
  const invCount = await Inventory.countDocuments();
  let inv = {};
  if (invCount === 0) {
    const items = [
      { itemName: "Paneer", unit: "kg", quantity: 20, thresholdLevel: 5, costPerUnit: 320, category: "Dairy" },
      { itemName: "Chicken", unit: "kg", quantity: 25, thresholdLevel: 6, costPerUnit: 260, category: "Meat" },
      { itemName: "Rice", unit: "kg", quantity: 50, thresholdLevel: 10, costPerUnit: 80, category: "Grains" },
      { itemName: "Tomato", unit: "kg", quantity: 15, thresholdLevel: 5, costPerUnit: 40, category: "Vegetable" },
      { itemName: "Onion", unit: "kg", quantity: 18, thresholdLevel: 5, costPerUnit: 35, category: "Vegetable" },
      { itemName: "Flour (Maida)", unit: "kg", quantity: 30, thresholdLevel: 8, costPerUnit: 45, category: "Grains" },
      { itemName: "Cheese", unit: "kg", quantity: 8, thresholdLevel: 3, costPerUnit: 400, category: "Dairy" },
      { itemName: "Cream", unit: "ltr", quantity: 10, thresholdLevel: 3, costPerUnit: 220, category: "Dairy" },
      { itemName: "Coffee Beans", unit: "kg", quantity: 6, thresholdLevel: 2, costPerUnit: 900, category: "Beverage" },
      { itemName: "Milk", unit: "ltr", quantity: 20, thresholdLevel: 5, costPerUnit: 60, category: "Dairy" },
      { itemName: "Sugar", unit: "kg", quantity: 12, thresholdLevel: 4, costPerUnit: 45, category: "Pantry" },
      { itemName: "Cocoa Powder", unit: "kg", quantity: 3, thresholdLevel: 1, costPerUnit: 500, category: "Pantry" },
    ];
    const created = await Inventory.insertMany(items);
    created.forEach((c) => (inv[c.itemName] = c._id));
    console.log("✅ Sample inventory created");
  } else {
    const all = await Inventory.find();
    all.forEach((c) => (inv[c.itemName] = c._id));
  }

  // ---------- Menu Items ----------
  const menuCount = await MenuItem.countDocuments();
  if (menuCount === 0) {
    await MenuItem.insertMany([
      {
        name: "Paneer Tikka",
        description: "Chargrilled cottage cheese cubes marinated in smoky spices and yogurt.",
        price: 249,
        category: "Starter",
        isVeg: true,
        isFeatured: true,
        image: "/images/paneer-tikka.jpg",
        ingredients: [
          { inventoryItem: inv["Paneer"], quantityRequired: 0.2 },
          { inventoryItem: inv["Onion"], quantityRequired: 0.05 },
        ],
      },
      {
        name: "Butter Chicken",
        description: "Slow-cooked chicken in a velvety tomato-butter gravy, a house signature.",
        price: 349,
        category: "Main Course",
        isVeg: false,
        isFeatured: true,
        image: "/images/butter-chicken.jpg",
        ingredients: [
          { inventoryItem: inv["Chicken"], quantityRequired: 0.3 },
          { inventoryItem: inv["Tomato"], quantityRequired: 0.15 },
          { inventoryItem: inv["Cream"], quantityRequired: 0.1 },
        ],
      },
      {
        name: "Veg Biryani",
        description: "Fragrant basmati rice layered with seasonal vegetables and saffron.",
        price: 279,
        category: "Main Course",
        isVeg: true,
        isFeatured: true,
        image: "/images/veg-biryani.jpg",
        ingredients: [
          { inventoryItem: inv["Rice"], quantityRequired: 0.25 },
          { inventoryItem: inv["Onion"], quantityRequired: 0.1 },
        ],
      },
      {
        name: "Margherita Pizza",
        description: "Wood-fired classic with San Marzano tomato, mozzarella & fresh basil.",
        price: 299,
        category: "Main Course",
        isVeg: true,
        image: "/images/margherita.jpg",
        ingredients: [
          { inventoryItem: inv["Flour (Maida)"], quantityRequired: 0.2 },
          { inventoryItem: inv["Cheese"], quantityRequired: 0.15 },
          { inventoryItem: inv["Tomato"], quantityRequired: 0.1 },
        ],
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm molten chocolate cake with a gooey centre, served with ice cream.",
        price: 179,
        category: "Dessert",
        isVeg: true,
        isFeatured: true,
        image: "/images/lava-cake.jpg",
        ingredients: [
          { inventoryItem: inv["Cocoa Powder"], quantityRequired: 0.05 },
          { inventoryItem: inv["Flour (Maida)"], quantityRequired: 0.05 },
          { inventoryItem: inv["Milk"], quantityRequired: 0.05 },
        ],
      },
      {
        name: "Classic Cold Coffee",
        description: "Rich espresso blended with cold milk, ice and a hint of cocoa.",
        price: 149,
        category: "Beverage",
        isVeg: true,
        image: "/images/cold-coffee.jpg",
        ingredients: [
          { inventoryItem: inv["Coffee Beans"], quantityRequired: 0.03 },
          { inventoryItem: inv["Milk"], quantityRequired: 0.15 },
          { inventoryItem: inv["Sugar"], quantityRequired: 0.02 },
        ],
      },
      {
        name: "Masala Papad",
        description: "Crisp roasted lentil wafer topped with onion, tomato & tangy spices.",
        price: 79,
        category: "Starter",
        isVeg: true,
        image: "/images/masala-papad.jpg",
        ingredients: [{ inventoryItem: inv["Onion"], quantityRequired: 0.03 }],
      },
      {
        name: "Family Combo (4 Pax)",
        description: "2 starters, 2 mains, rice & dessert - curated for a table of four.",
        price: 1199,
        category: "Combo",
        isVeg: false,
        isFeatured: true,
        image: "/images/family-combo.jpg",
        ingredients: [
          { inventoryItem: inv["Chicken"], quantityRequired: 0.4 },
          { inventoryItem: inv["Paneer"], quantityRequired: 0.2 },
          { inventoryItem: inv["Rice"], quantityRequired: 0.3 },
        ],
      },
    ]);
    console.log("✅ Sample menu items created (8 dishes)");
  }

  console.log("🌱 Seeding complete!");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
