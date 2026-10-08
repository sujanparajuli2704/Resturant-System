const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);