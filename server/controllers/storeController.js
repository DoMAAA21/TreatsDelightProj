const Store = require("../models/Store");
const Product = require("../models/Product");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.allStores = async (req, res, next) => {
  const stores = await Store.find({ deletedAt: { $eq: null } });;

  res.status(200).json({
    success: true,

    stores,
  });
};

exports.archivedStores = async (req, res, next) => {
  try {
    const deletedStores = await Store.find({ deletedAt: { $ne: null } });
    res.status(200).json({
      success: true,
      stores: deletedStores,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};


exports.newStore = async (req, res, next) => {
  const { name, slogan, stall, location, active } = req.body;
  const logo = req?.file?.path;
  
  try {

    if (!logo) {
      return res.status(400).json({
        success: false,
        message: 'Please Provide Logo',
      });
    }
   
    const result = await cloudinary.v2.uploader.upload(logo, {
      folder: 'stores',
    });

    const store = await Store.create({
      name,
      slogan,
      stall,
      location,
      active: active,
      logo: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    // Handle errors, e.g., database errors or Cloudinary upload errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Store.',
    });
  }
};


exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return next(new ErrorHandler(`Store not found with id: ${req.params.id}`));
    }
    await User.deleteMany({ 'store.storeId': store._id });

    // Soft delete the store
    store.deletedAt = new Date();
    store.active = false;
    await store.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};


exports.restoreStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return next(new ErrorHandler(`Store not found with id: ${req.params.id}`));
    }
    store.deletedAt = null;
    await store.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.getStoreDetails = async (req, res, next) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    return next(
      new ErrorHandler(`Store not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,

    store,
  });
};

exports.updateStore = async (req, res, next) => {
  try {
    const newStoreData = {
      name: req.body.name,
      slogan: req.body.slogan,
      stall: req.body.stall,
      location: req.body.location,
      active: req.body.active,
    };

    if (req.file && req.file.path !== null) {
      const store = await Store.findById(req.params.id);
      const image_id = store.logo.public_id;
      const res = await cloudinary.uploader.destroy(image_id);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "stores",
      });
      newStoreData.logo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    const store = await Store.findByIdAndUpdate(req.params.id, newStoreData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    // Update products associated with the store
    await Product.updateMany(
      { "store.storeId": store._id },
      { "store.name": store.name }
    );

    await User.updateMany(
      { "store.storeId": store._id },
      { "store.name": store.name }
    );

    res.status(200).json({
      success: true,
      store
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.updateStoreStatus = async (req, res, next) => {
  try {
    const oldStore = await Store.findById(req.params.id);
    

    if (!oldStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { $set: { active: !oldStore.active } },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    res.status(200).json({
      success: true,
      message: 'Store status updated successfully.',
      updatedStore: updatedStore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the Store status.',
    });
  }
};










