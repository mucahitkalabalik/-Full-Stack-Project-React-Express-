const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
