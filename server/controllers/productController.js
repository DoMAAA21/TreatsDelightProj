const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.allProducts = async (req, res, next) => {
  const storeId = req.params.id;
  const products = await Product.find({ 'store.storeId': storeId,
  $nor: [
    { category: 'Meals' },
  ],
  });

  res.status(200).json({
    success: true,

    products,
  });
};

exports.allMeals = async (req, res, next) => {
  const storeId = req.params.id;
  const products = await Product.find({$and:[{ 'store.storeId': storeId,'category':'Meals'}]});

  res.status(200).json({
    success: true,

    products,
  });
};

exports.allItems = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,

    products,
  });
};

exports.newProduct = async (req, res, next) => {
    const { name, description, costPrice, sellPrice, stock, portion, category, active, storeId, storeName } = req.body;
    try {
        const imagePaths = [];
        if (!req.files.firstImage) {
          return res.status(400).json({
            success: false,
            message: 'Please Provide  Image at the Leftmost',
          });
        }
        if (req.files.firstImage) {
            const firstImage = req.files.firstImage[0];
            const firstImageResult = await cloudinary.v2.uploader.upload(firstImage.path, {
                folder: 'products',
            });
            imagePaths.push({
                index: 0,
                public_id: firstImageResult.public_id,
                url: firstImageResult.secure_url,
            });
        }
        if (req.files.secondImage) {
            const secondImage = req.files.secondImage[0];
            const secondImageResult = await cloudinary.v2.uploader.upload(secondImage.path, {
                folder: 'products',
            });
            imagePaths.push({
                index: 1,
                public_id: secondImageResult.public_id,
                url: secondImageResult.secure_url,
            });
        }
        if (req.files.thirdImage) {
            const thirdImage = req.files.thirdImage[0];
            const thirdImageResult = await cloudinary.v2.uploader.upload(thirdImage.path, {
                folder: 'products',
            });
            imagePaths.push({
                index: 2,
                public_id: thirdImageResult.public_id,
                url: thirdImageResult.secure_url,
            });
        }

        const product = await Product.create({
            name,
            description,
            costPrice,
            sellPrice,
            portion,
            stock,
            category,
            active,
            images: imagePaths, 
            store: {
                storeId: storeId,
                name: storeName,
            },
            
        });

        res.status(201).json({
            success: true,
            product,
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
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler(`Product not found with id: ${req.params.id}`));
    }

    const imageIds = product.images.map((image) => image.public_id);
    for (const imageId of imageIds) {
      if (imageId) {
        await cloudinary.v2.uploader.destroy(imageId);
      }
    }

    // Delete the product from the database
    await product.deleteOne();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product.',
    });
  }
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

exports.updateProduct = async (req, res, next) => {
  const { name, description, costPrice, sellPrice, stock, portion, category, active, storeId, storeName } = req.body;
  try {
    const existingProduct = await Product.findById(req.params.id);
    const imagePaths = [...existingProduct.images];

    const deleteImage = async (public_id) => {
      if (public_id) {
        await cloudinary.v2.uploader.destroy(public_id);
      }
    };
    if (req.files.firstImage) {
      const firstImage = req.files.firstImage[0];
      const firstImageResult = await cloudinary.v2.uploader.upload(firstImage.path, {
        folder: 'products',
      });
      await deleteImage(imagePaths[0]?.public_id);
      imagePaths[0] = {
          index : 0,
          public_id: firstImageResult.public_id,
          url: firstImageResult.secure_url,
      };
    }
    if (req.files.secondImage) {
      const secondImage = req.files.secondImage[0];
      const secondImageResult = await cloudinary.v2.uploader.upload(secondImage.path, {
        folder: 'products',
      });
      await deleteImage(imagePaths[1]?.public_id);
      imagePaths[1] = {
        index : 1,
        public_id: secondImageResult.public_id,
        url: secondImageResult.secure_url,
      };
    }
    if (req.files.thirdImage) {
      const thirdImage = req.files.thirdImage[0];
      const thirdImageResult = await cloudinary.v2.uploader.upload(thirdImage.path, {
        folder: 'products',
      });
      await deleteImage(imagePaths[2]?.public_id);
      imagePaths[2] = {
        index : 2,
        public_id: thirdImageResult.public_id,
        url: thirdImageResult.secure_url,
      };
    }

    
    const newProductData = {
      name,
      description,
      costPrice,
      sellPrice,
      portion: false,
      stock,
      category,
      active,
      portion,
      images: imagePaths,
      store: {
        storeId,
        name: storeName,
      }
    };

    const product = await Product.findByIdAndUpdate(req.params.id, newProductData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the Product.',
    });
  }
};


exports.updateProductStatus = async (req, res, next) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { active: !oldProduct.active } },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      oldProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the Product.',
    });
  }
};


