const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" }, // Không required để Google đăng nhập được
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, default: "user" },
    provider: { type: String, default: "local" } // "local" hoặc "google"
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
