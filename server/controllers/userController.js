


const User = require("../models/User");

const ErrorHandler = require("../utils/errorHandler");

const sendToken = require("../utils/jwtToken");


// const sendEmail = require("../utils/sendEmail");

const cloudinary = require("cloudinary");



exports.allUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,

    users,
  });
};



//   console.log(req.body)
//   const result = await cloudinary.v2.uploader.upload(
//     req.body.avatar,
//      {
//        folder: "avatars",

//        width: 150,

//        crop: "scale",
//      },
//      (err, res) => {
//        console.log(err, res);
//      }
//    );
//    const {
//     fname,
//     lname,
//     course,
//     religion,
//     role,
//     email,
//     password,
//   } = req.body;

//   const user = await User.create({
//     fname,
//     lname,
//     course,
//     religion,
//     role,
//     email,
//     password,

//     avatar: {
//       public_id: result.public_id,

//       url: result.secure_url,
//     },
//   });



//   res.status(201).json({
//     success: true,

//     user,
//   });
// };


exports.newUser = async (req, res, next) => {
  const { fname, lname, course, religion, role, email, password, avatar } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    // If the email is unique, proceed with user creation
    const result = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    const user = await User.create({
      fname,
      lname,
      course,
      religion,
      role,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    // Handle errors, e.g., database errors or Cloudinary upload errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user.',
    });
  }
};


exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  console.log(user)
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
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: "scale"
  }, (err, res) => {
    console.log(err, res);
  });
  // return console.log(result)
  const { name,
    email,
    password,

  } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url
    }

    // avatar: {
    //     public_id: 'avatars/oqqqt5immgammiknebvc',
    //     url: 'https://res.cloudinary.com/dgneiaky7/image/upload/v1649422734/avatars/oqqqt5immgammiknebvc.png'
    // }
  })

  sendToken(user, 200, res)
};




exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,

    user,
  });
};