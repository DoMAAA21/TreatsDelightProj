const Store = require("../models/Store");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
// const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");

exports.allStores = async (req, res, next) => {
  const stores = await Store.find();

  res.status(200).json({
    success: true,

    stores,
  });
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
  const store = await Store.findById(req.params.id);


  if (!store) {
    return next(
      new ErrorHandler(`Store not found with id: ${req.params.id}`)
    );
  }

  // Remove avatar from cloudinary

  const image_id = store.logo.public_id;

  await cloudinary.v2.uploader.destroy(image_id);

  await store.deleteOne();

  res.status(200).json({
    success: true,
  });

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
  console.log(req.body)
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
    const result = await cloudinary.v2.uploader.upload(req.file.path,{
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

  
  res.status(200).json({
    success: true,
    store
  });
  console.log(res)
};











