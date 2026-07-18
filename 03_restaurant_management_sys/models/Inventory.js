const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true, unique: true },
    unit: { type: String, required: true, default: "unit" }, // kg, ltr, pcs, gm
    quantity: { type: Number, required: true, default: 0, min: 0 },
    thresholdLevel: { type: Number, required: true, default: 5 }, // low stock alert level
    costPerUnit: { type: Number, default: 0 },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

inventorySchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.thresholdLevel;
});

inventorySchema.set("toJSON", { virtuals: true });
inventorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Inventory", inventorySchema);
