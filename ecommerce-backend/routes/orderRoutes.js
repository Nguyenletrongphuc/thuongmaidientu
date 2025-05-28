const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { authenticateToken } = require("./auth");
const crypto = require("crypto");
const https = require("https");

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

    // Cập nhật tồn kho cho từng sản phẩm
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity, sold: item.quantity } },
        { new: true }
      );
    }

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
router.post("/pay/momo", authenticateToken, async (req, res) => {
  const { totalAmount, items, address, phone, paymentMethod } = req.body;

  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const redirectUrl = "http://localhost:5000/index.html"; // ✅ trang xác nhận đơn hàng
  const ipnUrl = "http://localhost:5000/index.html"; // nếu cần callback MoMo
  const orderInfo = "Thanh toán đơn hàng";
  const requestType = "captureWallet";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";

  const rawSignature =
    `accessKey=${accessKey}&amount=${totalAmount}&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount: totalAmount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    requestType,
    autoCapture: true,
    extraData,
    signature,
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  const momoReq = https.request(options, async momoRes => {
    let data = "";

    momoRes.on("data", chunk => {
      data += chunk;
    });

    momoRes.on("end", async () => {
      try {
        const result = JSON.parse(data);
        if (result.payUrl) {
          // ✅ Lưu đơn hàng vào MongoDB ngay sau khi có payUrl
          try {
            const newOrder = new Order({
              user: req.user.id,
              items,
              totalAmount,
              address,
              phone,
              paymentMethod: "momo",
              trangThaiThanhToan: "Đã thanh toán", // ✅ lưu trạng thái thành công
            });

            await newOrder.save();

            res.status(200).json({
              payUrl: result.payUrl,
              message: "Đã tạo đơn hàng và liên kết thanh toán MoMo thành công",
              orderId: newOrder._id,
            });
          } catch (saveErr) {
            console.error("Lỗi lưu đơn hàng:", saveErr);
            res.status(500).json({ message: "Tạo liên kết MoMo thành công nhưng lưu đơn hàng thất bại." });
          }
        } else {
          res.status(400).json({ message: "Không thể tạo liên kết MoMo", result });
        }
      } catch (err) {
        console.error("Lỗi phân tích phản hồi MoMo:", err);
        res.status(500).json({ message: "Phản hồi không hợp lệ từ MoMo" });
      }
    });
  });

  momoReq.on("error", error => {
    console.error("Lỗi gọi MoMo:", error);
    res.status(500).json({ message: "Lỗi kết nối MoMo" });
  });

  momoReq.write(requestBody);
  momoReq.end();
});
module.exports = router;
