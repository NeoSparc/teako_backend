const mongoose = require("mongoose");

const adminData = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const adminDataCollection = new mongoose.model("adminData", adminData);
module.exports = adminDataCollection;
