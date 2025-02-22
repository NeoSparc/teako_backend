const authCollection = require("../model/adminAuth");
const emailsection = require("../utility/email");
const nodemailer = require("../utility/nodemailer");
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
  try {
    const { email, password } = req.body;

    const user = await authCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ status: "userData not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ status: "incorrect password" });
    }

    const id = { id: user._id };
    const token = jwt.sign(id, process.env.JWT_TOCKEN_SECERT);

    res.status(200).json({
      status: "success",
      data: {
        id: user._id,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// confirming reset password email
exports.resetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await authCollection.findOne({ email: email });

    if (user) {
      const otp = generateOTP();
      const sentMail = emailsection.generateOtpContent(otp);
      await authCollection.findOneAndUpdate(
        { email: email },
        { $set: { otp: otp } }
      );

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Your OTP for Resetting Password",
        html: sentMail,
      };
      await nodemailer.sentEmailOtp(mailOptions);

      res
        .status(200)
        .json({ status: "OTP sent successfully to your email.", email: email });
    } else {
      res.status(200).json({ status: "Enter your correct email." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Internal server error." });
  }
};

// otp sent for reset password
exports.otpPost = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const data = await authCollection.findOne({ email: email });

    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (data.otp !== otp) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP verification failed" });
    }

    await authCollection.findOneAndUpdate(
      { email: email },
      { $set: { otp: "" } }
    );

    res
      .status(200)
      .json({ status: "success", message: "OTP verification successful" });
  } catch (error) {
    console.error("Error in otpPost:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// password resetting
exports.resetPassword = async (req, res) => {
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

    const emailContent = emailsection.resetPasswordSuccess;

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "Reset Password Successful!",
      html: emailContent,
    };

    nodemailer.sentEmailOtp(mailOptions);

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
