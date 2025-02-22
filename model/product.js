  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required:true
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
    imagePublicId:{
      type:String,
      required:true
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
