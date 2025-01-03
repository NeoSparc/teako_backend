const usersCollection = require("../model/callback");
const productCollection = require("../model/product");
const bannerCollection = require("../model/banner");
const offerCollection = require("../model/offer");
const productCallbackCollection = require("../model/productCallback");
const imgurService = require('../middleware/imgur')

// get all users list
exports.getallUsersList = async (req, res) => {
  console.log(req.body);
  try {
    const allUsers = await usersCollection.find();

    if (allUsers.length > 0) {
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: allUsers,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: err.message,
    });
  }
};

// Add New Product
exports.addNewProduct = async (req, res) => {
  console.log('this is body', req.body);

  try {
    const {
      productName,
      description,
      price,
      length,
      width,
      availability,
      category,
    } = req.body;

    if (!productName || !price || !availability || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, availability, image, and category are required fields.",
      });
    }

    const imgurResponse = await imgurService.uploadToImgur(req.file.buffer);
    console.log(imgurResponse);
    
    const image = imgurResponse.link;
    const deleteHash = imgurResponse.deletehash;

    const newProduct = new productCollection({
      productName,
      description,
      price,
      length,
      width,
      availability,
      image,
      deleteHash,
      category,
    });

    const savedProduct = await newProduct.save();
    console.log(savedProduct);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the product",
      error: err.message,
    });
  }
};


// Edit Product
exports.editProduct = async (req, res) => {
  try {
    const { productId, ...updateFields } = req.body;
    if (!productId) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updatedProduct = await productCollection.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error editing product:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
      error: err.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await productCollection.findByIdAndDelete(productId);

    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: err.message,
    });
  }
};

// Add Banner
exports.addBanner = async (req, res) => {
  try {
    const { image, discription } = req.body;

    if (!image) {
      res.status(400).json({
        success: false,
        message: "Image is a required field.",
      });
    }

    const newBanner = new bannerCollection({
      image,
      discription,
    });

    const savedBanner = await newBanner.save();

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      data: savedBanner,
    });
  } catch (err) {
    console.error("Error adding banner:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the banner",
      error: err.message,
    });
  }
};

// Edit Banner
exports.editBanner = async (req, res) => {
  try {
    const { bannerId, image, discription } = req.body;

    if (!bannerId) {
      res.status(400).json({
        success: false,
        message: "Banner ID is required.",
      });
    }

    const updateData = {};
    if (image) updateData.image = image;
    if (discription) updateData.discription = discription;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }
    const updatedBanner = await bannerCollection.findByIdAndUpdate(
      bannerId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBanner) {
      res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (err) {
    console.error("Error updating banner:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the banner",
      error: err.message,
    });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      res.status(400).json({
        success: false,
        message: "Banner ID is required.",
      });
    }

    const deletedBanner = await bannerCollection.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
      data: deletedBanner,
    });
  } catch (err) {
    console.error("Error deleting banner:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the banner",
      error: err.message,
    });
  }
};

// Create Offer
exports.createOffer = async (req, res) => {
  try {
    const { image, minOffer, maxOffer } = req.body;
    if (!image || !minOffer || !maxOffer) {
      res.status(400).json({
        success: false,
        message: "Image, minOffer, and maxOffer are required fields.",
      });
    }

    const newOffer = new offerCollection({
      image,
      minOffer,
      maxOffer,
    });

    const savedOffer = await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: savedOffer,
    });
  } catch (err) {
    console.error("Error creating offer:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the offer",
      error: err.message,
    });
  }
};

// Edit Offer
exports.editOffer = async (req, res) => {
  try {
    const { offerId, image, minOffer, maxOffer } = req.body;

    if (!offerId) {
      res.status(400).json({
        success: false,
        message: "Offer ID is required.",
      });
    }

    const updateFields = {};
    if (image !== undefined) updateFields.image = image;
    if (minOffer !== undefined) updateFields.minOffer = minOffer;
    if (maxOffer !== undefined) updateFields.maxOffer = maxOffer;

    const updatedOffer = await offerCollection.findByIdAndUpdate(
      offerId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOffer) {
      res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: updatedOffer,
    });
  } catch (err) {
    console.error("Error updating offer:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the offer",
      error: err.message,
    });
  }
};

// Delete Offer
exports.deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.body;

    if (!offerId) {
      res.status(400).json({
        success: false,
        message: "Offer ID is required.",
      });
    }

    const deletedOffer = await offerCollection.findByIdAndDelete(offerId);

    if (!deletedOffer) {
      res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
      data: deletedOffer,
    });
  } catch (err) {
    console.error("Error deleting offer:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the offer",
      error: err.message,
    });
  }
};

// Get All Users List with Product Details
exports.getAllUsersList = async (req, res) => {
  try {
    const allUsers = await productCallbackCollection.aggregate([
      {
        $sort: { createdAt: -1 } 
      },
      {
        $lookup: {
          from: "products", 
          localField: "productId", 
          foreignField: "_id", 
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails" 
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully fetched all user callback requests with product details.",
      data: allUsers
    });
  } catch (err) {
    console.error("Error fetching all users with product details:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching all users",
      error: err.message
    });
  }
};


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
