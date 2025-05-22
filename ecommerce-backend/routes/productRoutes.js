const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

// API thêm sản phẩm
router.post("/add-product", async (req, res) => {
    try {
        const { name, quantity, price, sold, description, image, category } = req.body;
        const newProduct = new Product({ name, quantity, price, sold, description, image, category });

        await newProduct.save();
        res.status(201).json({ message: "Thêm sản phẩm thành công!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
    }
});
//// API cập nhật sản phẩm

router.put("/update-product/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    sold: req.body.sold,
                    category: req.body.category,
                    description: req.body.description,
                    image: req.body.image
                }
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json({ message: "Cập nhật sản phẩm thành công", product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ khi cập nhật sản phẩm" });
    }
});
// API lấy danh sách sản phẩm có phân trang
router.get("/get-products", async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 15, 1);
        const skip = (page - 1) * limit;
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter).skip(skip).limit(limit)
        ]);

        res.status(200).json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
});
// API lấy chi tiết 1 sản phẩm theo id
router.get("/get-product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết sản phẩm", error });
    }
});
// API xóa sản phẩm
router.delete("/delete-product/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        // Kiểm tra xem sản phẩm có nằm trong đơn hàng chưa hoàn tất không
        const relatedOrders = await Order.find({
            "items.product": productId,
            trangThaiGiaoHang: { $nin: ["Đã giao", "Đã hủy"] }
        });

        if (relatedOrders.length > 0) {
            return res.status(400).json({
                message: "Không thể xóa sản phẩm vì đang có đơn hàng chưa giao xong chứa sản phẩm này."
            });
        }

        // Nếu không có đơn hàng liên quan chưa hoàn tất, cho phép xóa
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
// API tìm kiếm sản phẩm
router.get("/search", async (req, res) => {
    const query = req.query.query || "";
    try {
      const regex = new RegExp(query, "i"); // không phân biệt hoa thường
      const products = await Product.find({
        $or: [
          { name: regex },
          { description: regex }
        ]
      });
      res.json(products);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      res.status(500).json({ message: "Lỗi server!" });
    }
  });
  
  module.exports = router;