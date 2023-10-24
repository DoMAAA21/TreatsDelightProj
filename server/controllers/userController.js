


const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");



exports.allUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,

    users,
  });
};




exports.newUser = async (req, res, next) => {
  const { fname, lname, course, religion, role, email, password, avatar, storeId, storeName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    if (avatar === '') {
      return res.status(400).json({
        success: false,
        message: 'Please Provide Avatar',
      });
    }

    const result = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
    });

    const userData = {
      fname,
      lname,
      course,
      religion,
      role,
      email,
      password,
      store : {
        storeId: storeId,
        name: storeName,
      },
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };
    if (role === 'Employee' && storeId && storeName) {
      userData.store =  {
        storeId: storeId,
        name: storeName,
      }
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user.',
    });
  }
};



exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  // Remove avatar from cloudinary

  const image_id = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(image_id);

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });

};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,

    user,
  });
};

exports.updateUser = async (req, res, next) => {
  const { fname, lname, course, religion, role, email, password, avatar, storeId, storeName } = req.body;

  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (email !== user.email) {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered.',
        });
      }
    }

    const newUserData = {
      fname,
      lname,
      course,
      religion,
      role,
      email,
      store: (role === 'Employee' && storeId && storeName) ? { storeId, name: storeName } : null
    };

    if (password) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed
      newUserData.password = hashedPassword;
    }

   

    if (avatar !== '') {
      // Delete the previous avatar
      const image_id = user.avatar.public_id;
      const deleteResult = await cloudinary.uploader.destroy(image_id);

      // Upload the new avatar
      const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update the user's data
    const updatedUser = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user.',
    });
  }
};


exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Finding user in database
  // res.setHeader('Set-Cookie', 'isLoggedin=true');
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Checks if password is correct or not

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // console.log(user.token)
  const token = user.getJwtToken();

  // res.send("Thanks for visiting");



  sendToken(user, 200, res);
};


exports.googlelogin = async (req, res, next) => {

  console.log(req.body.response);


  const userfind = await User.findOne({ googleId: req.body.response.id })



  if (!userfind) {


    let createuser = await User.create({
      name: req.body.response.name,

      email: req.body.response.email,

      password: 'password',

      avatar: {
        public_id: 'avatars/rjeu182thkednbnlitqc',

        url: req.body.response.picture,
      },
      googleId: req.body.response.id
    });




    var user = await User.findOne({ googleId: createuser.googleId })
    sendToken(user, 200, res);


  }

  else {

    const user = await User.findOne({ googleId: req.body.response.id })

    sendToken(user, 200, res);

  }







};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),

    httpOnly: true,
  });

  res.status(200).json({
    success: true,

    message: "Logged out",
  });
};


exports.registerUser = async (req, res, next) => {
  const { fname, lname, course, religion, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const user = await User.create({
      fname,
      lname,
      course,
      religion,
      email,
      password,
      avatar: {
        public_id: 'avatars/oqqqt5immgammiknebvc',
        url: 'https://res.cloudinary.com/djttinjoh/image/upload/v1693557587/defaultavatar_pwre4e.png',
      },
    });
    sendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,

    user,
  });
};