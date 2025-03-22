const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);
router.get("/me", authMiddleware, userDetail);

module.exports = router;
