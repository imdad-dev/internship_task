const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true }, // snapshot of name at order time
    price: { type: Number, required: true }, // snapshot of price at order time
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, default: "" },
    orderType: { type: String, enum: ["dine-in", "takeaway"], default: "dine-in" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
