const Products = require("../models/product");
const cloudinary = require("cloudinary").v2;
const ProductFilter = require("../utils/ProductFilter");

const getProducts = async (req, res) => {
  try {
    const resultPerPage = 10;
    const page = parseInt(req.query.page) || 1; 
    const skip = (page - 1) * resultPerPage;    

    const productFilter = new ProductFilter(Products.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage, skip);

    const products = await productFilter.query;

    const totalProducts = await Products.countDocuments();

    res.status(200).json({
      success: true,
      statusCode: 200,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / resultPerPage),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const adminGetProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    } 
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    let images = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];

    const imagesLinks = await Promise.all(
      images.map(async (image) => {
        try {
          const result = await cloudinary.uploader.upload(image, {
            folder: "products",
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          });
          return { public_id: result.public_id, url: result.secure_url };
        } catch (error) {
          throw new Error("Image upload failed");
        }
      })
    );

    req.body.images = imagesLinks;

    const product = await Products.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.body.images) {
      let images = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];

      // Eski resimleri silme
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      const imagesLinks = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image, {
            folder: "products",
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      req.body.images = imagesLinks;
    }

    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Cloudinary'deki resimleri sil
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const product = await Products.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  adminGetProducts,
};
