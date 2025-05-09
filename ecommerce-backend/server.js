require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json());

// Cấu hình session cho Passport
app.use(session({
    secret: "someSecretKey", // Đưa vào .env là tốt nhất
    resave: false,
    saveUninitialized: false
}));

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Google OAuth2
require("./routes/passport");

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// Route kiểm tra server
app.get("/api", (req, res) => {
    res.send("✅ Server đang chạy...");
});

// Import các route API
const productRoutes = require("./routes/productRoutes");
const { router: authRoutes } = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");


app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "public")));

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
