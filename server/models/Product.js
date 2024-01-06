const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,

    required: [true, "Please enter your name"],

    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  description: {
    type: String,

    required: [true, "Please enter description"],

    maxLength: [100, "Description cannot exceed 100 characters"],
  },
  costPrice: {
    type: Number,

    required: [true, "Please enter cost Price"],

    maxLength: [10, "Cost Price cannot exceed 10 characters"],
  },
  sellPrice: {
    type: Number,

    required: [true, "Please enter sell Price"],

    maxLength: [10, "Sell Price cannot exceed 10 characters"],
  },
  portion: {
    type: Boolean,
    default: false,
    required: true,
  },
  stock: {
    type: Number,

    required: false,

    maxLength: [10, "Sell Price cannot exceed 10 characters"],

    default: 0,
  },
  images: [{
    index: {
      type: Number,
      required: true,
    },
    public_id: {
      type: String,

      required: true,
    },

    url: {
      type: String,

      required: true,
    },
  }],
  category: {
    type: String,

    required: false,
  },
  store: {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Store'
    },

    name: {
      type: String,

      required: true,
    }
  },
  active: {
    type: Boolean,
    default: false,
    required: true,
  },
  nutrition: {
    calories: {
      type: Number,
      default: 0,
      required: true,
    },
    protein: {
      type: Number,
      default: 0,
      required: true,
    },
    carbs: {
      type: Number,
      default: 0,
      required: true,
    },
    fiber: {
      type: Number,
      default: 0,
      required: true,
    },
    sugar: {
      type: Number,
      default: 0,
      required: true,
    },
    sodium: {
      type: Number,
      default: 0,
      required: true,
    },
  }

});

module.exports = mongoose.model("Products", productSchema);


