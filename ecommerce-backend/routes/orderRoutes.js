const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authenticateToken } = require("./auth");

// Tạo đơn hàng mới
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, address, phone, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      address,
      phone,
      paymentMethod
    });

    await newOrder.save();
    res.status(201).json({ message: "Tạo đơn hàng thành công", order: newOrder });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate("items.product");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
    }
});

module.exports = router;
