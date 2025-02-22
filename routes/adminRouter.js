const express = require("express");
const adminRouter = express.Router();
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtInterceptor')

const adminController = require("../controller/admin");

adminRouter.get("/users",jwtAuthentication, adminController.getallUsersList);
adminRouter.get("/users-with-product",jwtAuthentication, adminController.getAllUsersList);
adminRouter.get('/dashdata',jwtAuthentication,adminController.getAllUsersAndProducts)

adminRouter.get("/product/:id",jwtAuthentication, adminController.getSingleProduct);
adminRouter.post("/product",multer.upload, adminController.addNewProduct);
adminRouter.put("/product",jwtAuthentication, multer.upload , adminController.editProduct);
adminRouter.delete("/product/:productId",jwtAuthentication, adminController.deleteProduct);

adminRouter.get("/banner",jwtAuthentication, adminController.getAllBanners);
adminRouter.post("/banner",jwtAuthentication,multer.upload, adminController.addBanner);
adminRouter.post('/getSinglebanner' ,jwtAuthentication, adminController.getSingleBanner)
adminRouter.put("/banner",jwtAuthentication,multer.upload, adminController.editBanner);
adminRouter.delete("/banner/:bannerId",jwtAuthentication, adminController.deleteBanner);

adminRouter.get('/offer' , jwtAuthentication,adminController.getAllOffers)
adminRouter.post("/offer",jwtAuthentication,multer.upload, adminController.createOffer);
adminRouter.post('/getOffer',jwtAuthentication,adminController.getSingleOffer)
adminRouter.put("/offer",jwtAuthentication,multer.upload , adminController.editOffer);
adminRouter.delete("/offer/:offerId",jwtAuthentication, adminController.deleteOffer);

module.exports = adminRouter;
