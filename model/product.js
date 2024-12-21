const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
  },
  price: {
    type: [String],
  },
  lenght: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const productPost = new mongoose.model("products", productSchema);
module.exports = productPost;
