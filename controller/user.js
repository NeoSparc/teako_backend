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
    const { name, email, phoneNumber, place, id } = req.body;

    if (!name || !phoneNumber || !place || !id) {
      res.status(400).json({
        success: false,
        message:
          "Name, phone number, place, and product ID are required fields.",
      });
    }

    const newCallback = new productCallbackCollection({
      name,
      email,
      phoneNumber,
      place,
      productId: id,
    });

    const savedCallback = await newCallback.save();

    res.status(201).json({
      success: true,
      message: "Callback request submitted successfully",
      data: savedCallback,
    });
  } catch (err) {
    console.error("Error submitting callback request:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the callback request.",
      error: err.message,
    });
  }
};

// Show all products
exports.showAllProduct = async (req, res) => {
  try {
    const { searchIndex, selectedCategory } = req.body;

    const query = {};
    if (searchIndex) {
      query.$or = [
        { productName: { $regex: searchIndex, $options: "i" } },
        { description: { $regex: searchIndex, $options: "i" } },
      ];
    }

    if (selectedCategory && selectedCategory !== "All") {
      query.category = selectedCategory;
    }

    const products = await productCollection.find(query);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your criteria.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the products.",
      error: err.message,
    });
  }
};

// banner get
exports.getAllBanners = async (req, res) => {
  try {
    const allBanners = await bannerCollection.find();

    if (allBanners.length > 0) {
      res.status(200).json({
        success: true,
        message: "Banners retrieved successfully",
        data: allBanners,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No banners found",
      });
    }
  } catch (err) {
    console.error("Error fetching banners:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching banners",
      error: err.message,
    });
  }
};

// get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const allOffers = await offerCollection.find().limit(3);

    if (allOffers.length > 0) {
      res.status(200).json({
        success: true,
        message: "Offers retrieved successfully",
        data: allOffers,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No offers found",
      });
    }
  } catch (err) {
    console.error("Error fetching offers:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching offers",
      error: err.message,
    });
  }
};

// get produts related to category
exports.getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      res.status(400).json({ message: "Category is required." });
    }

    const relatedProducts = await productCollection.find({ category }).limit(4);

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// get 3 randome products
exports.getRandomProducts = async (req, res) => {
  try {
    const products = await productCollection.aggregate([
      { $match: { availability: true } },
      { $sample: { size: 3 } },
    ]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Random products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products",
      error: err.message,
    });
  }
};
