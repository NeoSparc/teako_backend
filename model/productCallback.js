const mongoose = require("mongoose");

const proCallbackShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required:true
  },
  place: {
    type: String,
    required:true
  },
  productId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const requistsCollection = new mongoose.model("productCallback", proCallbackShema);
module.exports = requistsCollection;
