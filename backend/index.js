const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes); 
app.use("/api/users", userRoutes); 

db();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
