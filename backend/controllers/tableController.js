const Table = require("../models/Table");

const createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ message: "Table created", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!table) return res.status(404).json({ message: "Table not found" });

    res.json({ message: "Table updated", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) return res.status(404).json({ message: "Table not found" });

    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTable,
  getTables,
  updateTable,
  deleteTable,
};