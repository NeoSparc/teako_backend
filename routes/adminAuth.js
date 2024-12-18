const express =require('express')
const authRouter = express.Router()

const authController = require('../controller/adminAuth')

authRouter.post('/login',authController.adminLogin)
authRouter.post('/resetpassemail',authController.resetPasswordEmail)
authRouter.post('/otp',authController.otpPost)
authRouter.post('/resetpassword',authController.resetPassword)


module.exports = authRouter