const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  adminGetProducts,
} = require("../controllers/product");

const router = express.Router();
router.route("/products").get(getProducts);
router.route("/products").post(authMiddleware, adminMiddleware, createProduct);

router.route("/products/:id").get(getProduct);
router.route("/products/:id").put(authMiddleware, adminMiddleware, updateProduct);
router.route("/products/:id").delete(authMiddleware, adminMiddleware, deleteProduct);

router.route("/review").put(authMiddleware, authMiddleware, createReview);

router
  .route("/admin/products")
  .get(authMiddleware, adminMiddleware, adminGetProducts);

module.exports = router;
