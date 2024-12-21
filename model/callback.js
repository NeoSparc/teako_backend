const mongoose = require("mongoose");

const requistShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required:true
  },
  phoneNumber: {
    type: String,
    required:true
  },
  place: {
    type: String,
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

const requistsCollection = new mongoose.model("callRequists", requistShema);
module.exports = requistsCollection;
