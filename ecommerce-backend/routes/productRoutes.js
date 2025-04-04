const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// API thêm sản phẩm
router.post("/add-product", async (req, res) => {
    try {
        const { name, quantity, price, sold, description, image } = req.body;
        const newProduct = new Product({ name, quantity, price, sold, description, image });

        await newProduct.save();
        res.status(201).json({ message: "Thêm sản phẩm thành công!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
    }
});

module.exports = router;
// API lấy danh sách sản phẩm
router.get("/get-products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
});
// API xóa sản phẩm
router.delete("/delete-product/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
        }

        res.status(200).json({ message: "Xóa sản phẩm thành công!" });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
