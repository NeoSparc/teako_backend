const usersCollection = require("../model/callback");
const productCollection = require("../model/product");
const bannerCollection = require("../model/banner");
const offerCollection = require("../model/offer");
const productCallbackCollection = require("../model/productCallback");

// Get Single Product
exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await productCollection.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product.",
      error: err.message,
    });
  }
};

// Connect With Us Form Submission
exports.connectWithUs = async (req, res) => {
  try {
    const { name, email, phoneNumber, place, category } = req.body;

    if (!name || !email || !phoneNumber || !place || !category) {
      res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newRequest = new usersCollection({
      name,
      email,
      phoneNumber,
      place,
      category,
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request submitted successfully.",
      data: savedRequest,
    });
  } catch (err) {
    console.error("Error submitting request:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the request.",
      error: err.message,
    });
  }
};

// Product Callback Form Submission
exports.productCallBack = async (req, res) => {
  try {
    const { name, email, phoneNumber, place, productId } = req.body;

    if (!name || !phoneNumber || !place || !productId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone number, place, and product ID are required fields.",
      });
    }

    const newCallback = new requistsCollection({
      name,
      email,
      phoneNumber,
      place,
      productId,
    });

    const savedCallback = await newCallback.save();

    return res.status(201).json({
      success: true,
      message: "Callback request submitted successfully.",
      data: savedCallback,
    });
  } catch (err) {
    console.error("Error submitting callback request:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting the callback request.",
      error: err.message,
    });
  }
};

// Show all products
exports.showAllProduct = async (req, res) => {
  try {
    const products = await productCollection.find();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the products.",
      error: err.message,
    });
  }
};
