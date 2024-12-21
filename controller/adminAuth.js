const authCollection = require("../model/adminAuth");
const emailsection = require('../utility/email')
const nodemailer = require('../utility/nodemailer')
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

const generateOTP = () => {
  return otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

// admin logn post
exports.adminLogin = async (req, res) => {
  console.log(req.body);
  //   const { email, password } = req.body;
  //   const user = await authCollection.findOne({ email: email });

  //   if (user) {
  //     const passwordCheck = await bcrypt.compare(password, user.password);
  //     if (passwordCheck) {
  //       const id = { id: user._id };
  //       const token = jwt.sign(id, process.env.JWT_TOCKEN_SECERT);
  //       res.status(200).json({
  //         status: "success",
  //         data: {
  //           id: user._id,
  //           email: user.email,
  //           roll: user.roll,
  //         },
  //         token: token,
  //       });
  //     } else {
  //       res.status(200).json({ status: "incorrect password" });
  //     }
  //   } else {
  //     res.status(200).json({ status: "userData not fount" });
  //   }
};

// confirming reset password email
exports.resetPasswordEmail = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    const user = await adminDataCollection.findOne({ email: email });

    if (user) {
      const otp = generateOTP(); 
      const sentMail = emailsection.generateOtpContent(otp)
      await authCollection.findOneAndUpdate(
        { email: email },
        { $set: { otp: otp } }
      ); 

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject: 'Your OTP for Resetting Password',
        html:sentMail, 
      };
      await sendEmailOtp(mailOptions); 

      res.status(200).json({ status: 'OTP sent successfully to your email.' });
    } else {
      res.status(200).json({ status: 'Enter your correct email.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'Internal server error.' });
  }
};

// otp sent for reset password
exports.otpPost = async (req, res) => {
  console.log(req.body);
  const { otp, email } = req.body;

  const data = await authCollection.findOne({ email: email });
  if (data) {
    if (data.otp === otp) {
      const emailContend = emailsection.resetPasswordSuccess
      await authCollection.findOneAndUpdate(
        {
          email: email,
        },
        {
          $set: {
            otp: "",
          },
        }
      );

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: data.email,
        subject: "Reset password Successful!",

        html: emailContend,
      };
      nodemailer.sentEmailOtp(mailOptions);

      res.status(200).json("otp verification success");
    } else {
      res.status(200).json("otp verification failed");
    }
  }
};

// password resetting
exports.resetPassword = async (req, res) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;

    const user = await authCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedData = {};
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await authCollection.findOneAndUpdate(
      { email: email },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    res
      .status(200)
      .json({ message: "Password updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the password" });
  }
};
