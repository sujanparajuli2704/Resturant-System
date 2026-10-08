const Bill = require("../models/Bill");
const Order = require("../models/Order");

const createBill = async (req, res) => {
  try {
    const { orderId, discount = 0, vatPercent = 13, paymentMethod = "cash" } = req.body;

    const order = await Order.findById(orderId).populate("table");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const subtotal = order.totalAmount;
    const vatAmount = ((subtotal - discount) * vatPercent) / 100;
    const grandTotal = subtotal - discount + vatAmount;

    const bill = await Bill.create({
      order: orderId,
      subtotal,
      discount,
      vatPercent,
      vatAmount,
      grandTotal,
      paymentMethod,
      paymentStatus: "unpaid",
    });

    res.status(201).json({
      message: "Bill generated successfully",
      bill,
      receipt: {
        table: order.table.tableNumber,
        items: order.items,
        subtotal,
        discount,
        vatPercent,
        vatAmount,
        grandTotal,
        paymentMethod,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate({
        path: "order",
        populate: {
          path: "table",
        },
      })
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBillStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["paid", "unpaid", "credit"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({
      message: "Bill status updated",
      bill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBill,
  getBills,
  updateBillStatus,
};