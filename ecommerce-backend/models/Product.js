const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    description: { type: String },
    image: { type: String } // URL ảnh
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
