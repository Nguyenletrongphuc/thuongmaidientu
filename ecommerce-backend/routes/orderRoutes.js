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
// Lấy danh sách đơn hàng của từng người dùng
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate("items.product");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
    }
});
// lấy tất cả đơn hàng
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // lấy mới nhất trước
    res.status(200).json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy tất cả đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
});
// chi tiết đơn hàng
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
  .populate("user", "name")
  .populate("items.product", "name");
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    res.json(order);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng' });
  }
});
// Cập nhật đơn hàng
router.put("/:id", async (req, res) => {
  try {
    const { trangThaiGiaoHang, trangThaiThanhToan } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(trangThaiGiaoHang && { trangThaiGiaoHang }),
        ...(trangThaiThanhToan && { trangThaiThanhToan }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "Cập nhật đơn hàng thành công", order: updatedOrder });
  } catch (err) {
    console.error("Lỗi khi cập nhật đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
  }
});
// Xóa đơn hàng
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi xóa đơn hàng" });
  }
});
module.exports = router;
