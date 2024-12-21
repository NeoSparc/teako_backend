const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  minOffer: {
    type: String,
    required:true
  },
  maxOffer: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const offerCollection = new mongoose.model("offers", offerSchema);
module.exports = offerCollection;
