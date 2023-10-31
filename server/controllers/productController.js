const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.allProducts = async (req, res, next) => {
  const storeId = req.params.id;
  const products = await Product.find({ 'store.storeId': storeId });

  res.status(200).json({
    success: true,

    products,
  });
};

exports.newProduct = async (req, res, next) => {
  const { name, description, costPrice, sellPrice, stock, category, active, storeId, storeName } = req.body;
  const image = req?.file?.path;
  try {
   
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: 'products',
    });

    const store = await Product.create({
      name,
      description,
      costPrice,
      sellPrice,
      stock,
      category,
      active,
      store: {
        storeId: storeId,
        name: storeName,
      },
      firstImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Product.',
    });
  }
};


exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id: ${req.params.id}`)
    );
  }
  const image_id = product.firstImage.public_id;
  if(image_id){
    await cloudinary.v2.uploader.destroy(image_id);
  }
  await product.deleteOne();

  res.status(200).json({
    success: true,
  });
};

exports.getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorHandler(`Product not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,

    product,
  });
};





