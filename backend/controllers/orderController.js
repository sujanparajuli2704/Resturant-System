const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");

const createOrder = async (req, res) => {
  try {
    const { tableId, items, note } = req.body;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Table not found" });

    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      const subtotal = menuItem.price * item.quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    const order = await Order.create({
      table: tableId,
      items: orderItems,
      totalAmount,
      note,
    });

    table.status = "occupied";
    await table.save();

    const populatedOrder = await Order.findById(order._id).populate("table");

    res.status(201).json({
      message: "Order created and sent to kitchen",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("table")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("table");

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    if (status === "completed" || status === "cancelled") {
      await Table.findByIdAndUpdate(order.table._id, { status: "free" });
    }

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};