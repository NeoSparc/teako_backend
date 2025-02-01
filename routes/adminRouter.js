const express = require("express");
const adminRouter = express.Router();
const multer = require('../middleware/multer')

const adminController = require("../controller/admin");

adminRouter.get("/users", adminController.getallUsersList);
adminRouter.get("/users-with-product", adminController.getAllUsersList);

adminRouter.post("/product",multer.upload, adminController.addNewProduct);
adminRouter.put("/product", multer.upload , adminController.editProduct);
adminRouter.delete("/product/:productId", adminController.deleteProduct);
adminRouter.get("/product/:id", adminController.getSingleProduct);

adminRouter.post("/banner",multer.upload, adminController.addBanner);
adminRouter.put("/banner",multer.upload, adminController.editBanner);
adminRouter.delete("/banner", adminController.deleteBanner);

adminRouter.post("/offer",multer.upload, adminController.createOffer);
adminRouter.put("/offer",multer.upload , adminController.editOffer);
adminRouter.delete("/offer", adminController.deleteOffer);

module.exports = adminRouter;
