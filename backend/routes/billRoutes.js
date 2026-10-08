const express = require("express");

const {
  createBill,
  getBills,
  updateBillStatus,
} = require("../controllers/billController");

const router = express.Router();

router.post("/", createBill);
router.get("/", getBills);
router.put("/:id/status", updateBillStatus);

module.exports = router;