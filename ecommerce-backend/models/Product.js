const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { 
        type: Number, 
        required: true,
        get: value => parseFloat(value.toFixed(2)), // Đảm bảo lưu số thực với 2 chữ số thập phân
        set: value => parseFloat(value) // Chuyển đổi giá trị nhập vào thành số thực
    },
    sold: { type: Number, default: 0 },
    description: { type: String },
    image: { type: String } ,
    category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
