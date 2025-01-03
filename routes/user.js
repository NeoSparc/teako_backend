const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user');

userRouter.get('/product/:id', userController.getSingleProduct); 
userRouter.post('/connect', userController.connectWithUs); 
userRouter.post('/callback', userController.productCallBack); 
userRouter.get('/products', userController.showAllProduct); 
userRouter.get('/offers', userController.getAllOffers);
userRouter.get('/banners', userController.getAllBanners);

module.exports = userRouter;
