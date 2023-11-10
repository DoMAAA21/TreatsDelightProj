


const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");

const bcrypt = require("bcryptjs");

const cloudinary = require("cloudinary");



exports.allEmployees = async (req, res, next) => {
  const { id } = req.params;
    const employees = await User.find({$and: [{ 'role': 'Employee' },{ 'store.storeId': id } ] });

  res.status(200).json({
    success: true,
    employees,
  });
};




exports.newEmployee = async (req, res, next) => {
  const { fname, lname, course, religion, email, password, storeId, storeName } = req.body;
  const avatar = req?.file?.path;
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

    const employeeData = {
      fname,
      lname,
      course,
      religion,
      role : 'Employee',
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
  
    const employee = await User.create(employeeData);

    res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Employee.',
    });
  }
};





