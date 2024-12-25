  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required:true
    },
    length: {
      type: String,
    },
    width: {
      type: String,
    },
    availability:{
      type:Boolean,
      required:true
    },
    image:{
      type:String,
      required:true
    },
    category:{
      type:String,
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

  const productPost = new mongoose.model("products", productSchema);
  module.exports = productPost;
