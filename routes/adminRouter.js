const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controller/admin");

adminRouter.get("/users", adminController.getallUsersList);
adminRouter.get("/users-with-product", adminController.getAllUsersList);

adminRouter.post("/product", adminController.addNewProduct);
adminRouter.put("/product", adminController.editProduct);
adminRouter.delete("/product", adminController.deleteProduct);
adminRouter.get("/product/:id", adminController.getSingleProduct);

adminRouter.post("/banner", adminController.addBanner);
adminRouter.put("/banner", adminController.editBanner);
adminRouter.delete("/banner", adminController.deleteBanner);

adminRouter.post("/offer", adminController.createOffer);
adminRouter.put("/offer", adminController.editOffer);
adminRouter.delete("/offer", adminController.deleteOffer);

module.exports = adminRouter;
