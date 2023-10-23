const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.allProducts = async (req, res, next) => {
  const storeId = req.params.id;
  console.log(req.params.id);
  const products = await Product.find({ 'store.storeId': storeId });

  res.status(200).json({
    success: true,

    products,
  });
};


