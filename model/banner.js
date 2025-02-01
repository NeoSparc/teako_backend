const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
  },
  deleteHash:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bannerCollection = new mongoose.model("banner", bannerSchema);
module.exports = bannerCollection;
