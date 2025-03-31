require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Để đọc dữ liệu JSON từ request

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Kết nối MongoDB thành công!"))
.catch(err => console.log("Lỗi kết nối MongoDB:", err));

// API mẫu để kiểm tra server
app.get("/", (req, res) => {
    res.send("Server đang chạy...");
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
//product routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
