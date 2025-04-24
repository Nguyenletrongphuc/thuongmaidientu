const express = require("express");
const { authenticateToken } = require("./auth");
const User = require("../models/User");

const router = express.Router();

// API: Lấy thông tin người dùng
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Không trả về mật khẩu
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
module.exports = router;