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
  const { name, slogan, stall, location, active, logo } = req.body;

  try {
    // Convert 'true' and 'false' strings to actual boolean values
    const isActive = active === 'true';

    // If the email is unique, proceed with user creation
    const result = await cloudinary.v2.uploader.upload(logo, {
      folder: 'stores',
      width: 150,
      crop: 'scale',
    });

    const store = await Store.create({
      name,
      slogan,
      stall,
      location,
      active: isActive,
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

exports.updateUser = async (req, res, next) => {
  const newUserData = {
    fname: req.body.fname,
    lname: req.body.lname,
    password: req.body.password,
    course: req.body.course,
    religion: req.body.religion,
    email: req.body.email,
    role: req.body.role,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.params.id);
    const image_id = user.avatar.public_id;
    const res = await cloudinary.uploader.destroy(image_id);
    const result = await cloudinary.v2.uploader.upload(
      req.body.avatar,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      },
      (err, res) => {
        console.log(err, res);
      }
    );
    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }


  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,

    runValidators: true,

    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    user
  });
};










