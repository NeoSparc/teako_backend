const usersCollection = require("../model/callback");
const productCollection = require("../model/product");
const bannerCollection = require("../model/banner");
const offerCollection = require("../model/offer");
const productCallbackCollection = require("../model/productCallback");
const cloudinary = require("../middleware/cloudinary");
const streamifier = require("streamifier");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// get all users list
exports.getallUsersList = async (req, res) => {
  try {
    const allUsers = await usersCollection.find().sort({ createdAt: -1 });

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

    // Upload image to Cloudinary
    const result = await uploadFromBuffer(req.file.buffer);

    const newProduct = new productCollection({
      productName,
      description,
      price,
      width,
      length,
      availability,
      image: result.url,
      imagePublicId: result.public_id,
      category,
    });

    const savedProduct = await newProduct.save();

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
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (Object.keys(updateFields).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const existingProduct = await productCollection.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.file) {
      if (existingProduct.imagePublicId) {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      }

      const uploadResult = await uploadFromBuffer(req.file.buffer);

      updateFields.image = uploadResult.url;
      updateFields.imagePublicId = uploadResult.public_id;
    }

    const updatedProduct = await productCollection.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error editing product:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
      error: err.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productCollection.findById(productId);
    const deleteImage = await cloudinary.uploader.destroy(
      product.imagePublicId
    );
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

// get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerCollection.find().sort({ createdAt: -1 });

    if (banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No banners found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banners retrieved successfully",
      data: banners,
    });
  } catch (err) {
    console.error("Error fetching banners:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching banners",
      error: err.message,
    });
  }
};

// get single banner
exports.getSingleBanner = async (req, res) => {
  try {
    const { bannerId } = req.body;
    const banner = await bannerCollection.findById(bannerId);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "No banner found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner retrieved successfully",
      data: banner,
    });
  } catch (err) {
    console.error("Error fetching banner:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the banner",
      error: err.message,
    });
  }
};

// Add Banner
exports.addBanner = async (req, res) => {
  try {
    const { discription } = req.body;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Image is a required field.",
      });
    }

    const result = await uploadFromBuffer(req.file.buffer);

    const newBanner = new bannerCollection({
      image: result.url,
      discription,
      imagePublicId: result.public_id,
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
    const { bannerId, discription } = req.body;

    if (!bannerId) {
      res.status(400).json({
        success: false,
        message: "Banner ID is required.",
      });
    }

    const updateData = {};
    if (req.file) {
      const banner = await bannerCollection.findById(bannerId);
      const deleteImage = await cloudinary.uploader.destroy(
        banner.imagePublicId
      );
      const uploadResult = await uploadFromBuffer(req.file.buffer);

      updateData.image = uploadResult.url;
      updateData.imagePublicId = uploadResult.public_id;
    }

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
    const bannerId = req.params.bannerId;

    if (!bannerId) {
      res.status(400).json({
        success: false,
        message: "Banner ID is required.",
      });
    }

    const banner = await bannerCollection.findById(bannerId);
    const deleteImage = await cloudinary.uploader.destroy(banner.imagePublicId);
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

// get single offer
exports.getSingleOffer = async (req, res) => {
  try {
    const { offerId } = req.body;
    const offer = await offerCollection.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "No offer found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer retrieved successfully",
      data: offer,
    });
  } catch (err) {
    console.error("Error fetching offers:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching offers",
      error: err.message,
    });
  }
};

// Get All Offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await offerCollection.find().sort({ createdAt: -1 });

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No offers found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offers retrieved successfully",
      data: offers,
    });
  } catch (err) {
    console.error("Error fetching offers:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching offers",
      error: err.message,
    });
  }
};

// Create Offer
exports.createOffer = async (req, res) => {
  try {
    const { minOffer, maxOffer } = req.body;

    if (!req.file || !minOffer || !maxOffer) {
      res.status(400).json({
        success: false,
        message: "Image, minOffer, and maxOffer are required fields.",
      });
    }

    const result = await uploadFromBuffer(req.file.buffer);

    const newOffer = new offerCollection({
      image: result.url,
      minOffer,
      maxOffer,
      imagePublicId: result.public_id,
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
    const { offerId, minOffer, maxOffer } = req.body;

    if (!offerId) {
      res.status(400).json({
        success: false,
        message: "Offer ID is required.",
      });
    }

    const updateFields = {};
    if (req.file) {
      const offer = await offerCollection.findById(offerId);
      const deleteImage = await cloudinary.uploader.destroy(
        offer.imagePublicId
      );
      const updateData = await uploadFromBuffer(req.file.buffer);

      updateFields.image = updateData.url;
      updateFields.imagePublicId = updateData.public_id;
    }
    updateFields.minOffer = minOffer;
    updateFields.maxOffer = maxOffer;

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
    const offerId = req.params.offerId;

    if (!offerId) {
      res.status(400).json({
        success: false,
        message: "Offer ID is required.",
      });
    }

    const offer = await offerCollection.findById(offerId);

    const deleteImage = await cloudinary.uploader.destroy(offer.imagePublicId);

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
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
    ]);

    res.status(200).json({
      success: true,
      message:
        "Successfully fetched all user callback requests with product details.",
      data: allUsers,
    });
  } catch (err) {
    console.error(
      "Error fetching all users with product details:",
      err.message
    );
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching all users",
      error: err.message,
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

// get requst for dashbord
exports.getAllUsersAndProducts = async (req, res) => {
  try {
    const callRequistsUsers = await usersCollection
      .find()
      .sort({ createdAt: -1 });
    const productCallbackUsers = await productCallbackCollection
      .find()
      .sort({ createdAt: -1 });
    const allProducts = await productCollection.find().sort({ createdAt: -1 });

    const totalUsers = callRequistsUsers.length + productCallbackUsers.length;

    if (totalUsers > 0 || allProducts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Users and products retrieved successfully",
        totalUsers,
        totalProducts: allProducts.length,
        callRequistsUsers,
        productCallbackUsers,
        products: allProducts,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No users or products found",
      });
    }
  } catch (err) {
    console.error("Error fetching users and products:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users and products",
      error: err.message,
    });
  }
};
