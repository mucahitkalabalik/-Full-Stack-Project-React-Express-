const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user"); // ✅ HATALI KISIM DÜZELTİLDİ!
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json({ limit: "50mb" })); // ✅ bodyParser yerine express.json() kullanıldı!
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API route'ları
app.use("/api/products", productRoutes); // ✅ Çakışmayı önlemek için `/api/products`
app.use("/api/users", userRoutes); // ✅ `/api/users/register` şeklinde erişilecek

// Veritabanına bağlan
db();

const PORT = process.env.PORT || 5000;

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
