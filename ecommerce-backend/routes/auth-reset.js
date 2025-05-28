const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendOTP = require("./sendMail");

const otpMap = new Map(); // email -> { otp, expires }

router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email không được để trống." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng với email này." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMap.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
    await sendOTP(email, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn." });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    res.status(500).json({ message: "Lỗi server khi gửi mã OTP." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const entry = otpMap.get(email);
    if (!entry || entry.otp !== otp || entry.expires < Date.now()) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    otpMap.delete(email);

    res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật mật khẩu." });
  }
});

module.exports = router;
