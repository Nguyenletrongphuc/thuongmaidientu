const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
require("dotenv").config();
require("./passport"); // Đã cập nhật từ config/passport sang routes/passport

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5500";

const router = express.Router();

// ======================== Đăng ký ========================
router.post("/register", async (req, res) => {
    console.log("Dữ liệu nhận được từ client:", req.body);
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            provider: "local"
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// ======================== Đăng nhập ========================
router.post("/login", async (req, res) => {
    console.log("Dữ liệu nhận được từ client:", req.body);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Đăng nhập thành công!", token, name: user.name, role: user.role });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// ======================== Google OAuth ========================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
}), (req, res) => {
    const token = jwt.sign({ id: req.user._id, name: req.user.name, role: req.user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${CLIENT_URL}/signup.html?token=${token}&name=${req.user.name}&role=${req.user.role}`);
});

// ======================== Middleware xác thực ========================
const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

    const token = authHeader.split(" ")[1]; // Tách từ "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Token không hợp lệ!" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ!" });
    }
};


module.exports = { router, authenticateToken };
