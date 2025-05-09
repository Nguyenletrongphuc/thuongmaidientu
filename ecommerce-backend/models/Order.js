const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "momo"],
    default: "cod",
  },
  trangThaiThanhToan: {
    type: String,
    enum: ["Chưa thanh toán", "Đã thanh toán", "Đã hoàn tiền"],
    default: "Chưa thanh toán",
  },
  trangThaiGiaoHang: {
    type: String,
    enum: ["Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"],
    default: "Chờ xử lý",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Order", orderSchema);
