const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,

    required: [true, "Please enter your name"],

    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  slogan: {
    type: String,

    required: [true, "Please enter description"],

    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  logo: {
    public_id: {
      type: String,

      required: true,
    },

    url: {
      type: String,

      required: true,

      default: "https://wallpapercave.com/wp/wc1700893.jpg",
    },
  },

  stall: {
    type: Number,

    required: [true, "Please enter stall No."],
  },
  location: {
    type: String,

    required: [true, "Please enter location"],
  },
  active: {
    type: Boolean,
    default: false,
    required: true,
  },

});

module.exports = mongoose.model("Store", storeSchema);


