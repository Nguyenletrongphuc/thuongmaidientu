const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


// Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Đăng nhập thành công!", token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Xác thực middleware
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ!" });
    }
};

module.exports = { router, authenticateToken };
