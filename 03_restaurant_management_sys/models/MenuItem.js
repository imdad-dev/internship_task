const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    quantityRequired: { type: Number, required: true, min: 0 }, // consumed per 1 order of this dish
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Starter", "Main Course", "Dessert", "Beverage", "Combo"],
      default: "Main Course",
    },
    image: { type: String, default: "/images/default-dish.jpg" },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    ingredients: [ingredientSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
