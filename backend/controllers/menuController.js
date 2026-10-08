const MenuItem = require("../models/MenuItem");

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    const item = await MenuItem.create({
      name,
      category,
      price,
      description,
      image,
    });

    res.status(201).json({
      message: "Menu item created",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    item.name = req.body.name || item.name;
    item.category = req.body.category || item.category;
    item.price = req.body.price || item.price;
    item.description = req.body.description || item.description;
    item.image = req.body.image || item.image;

    if (req.body.isAvailable !== undefined) {
      item.isAvailable = req.body.isAvailable;
    }

    const updatedItem = await item.save();

    res.json({
      message: "Menu item updated",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    await item.deleteOne();

    res.json({
      message: "Menu item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};