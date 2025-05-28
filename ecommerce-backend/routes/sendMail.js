const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendOTP(email, otp) {
  console.log(`🔐 Gửi OTP ${otp} đến email: ${email}`);
  await transporter.sendMail({
    from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Khôi phục mật khẩu",
    html: `<p>Mã OTP của bạn là: <strong>${otp}</strong>. Có hiệu lực trong 10 phút.</p>`,
  });
};
