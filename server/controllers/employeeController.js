


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

    if (!avatar) {
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

exports.getEmployeeDetails = async (req, res, next) => {
  const employee = await User.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorHandler(`Employee does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,

    employee,
  });
};

exports.updateEmployee = async (req, res, next) => {
  const { fname, lname, course, religion, email, password } = req.body;

  try {
    const employee = await User.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (email !== employee.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered.',
        });
      }
    }

    const newEmployeeData = {
      fname,
      lname,
      course,
      religion,
      role: 'Employee',
      email,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      newEmployeeData.password = hashedPassword;
    }


    if (req.file && req.file.path !== null) {
      const image_id = employee.avatar.public_id;
      const deleteResult = await cloudinary.uploader.destroy(image_id);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      newEmployeeData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedEmployee = await User.findByIdAndUpdate(req.params.id, newEmployeeData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user.',
    });
  }
};

exports.deleteEmployee = async (req, res, next) => {
  const employee = await User.findById(req.params.id);
  if (!employee) {
    return next(
      new ErrorHandler(`Employee does not found with id: ${req.params.id}`)
    );
  }
  const image_id = employee?.avatar?.public_id;

  await cloudinary.v2.uploader.destroy(image_id);

  await employee.deleteOne();

  res.status(200).json({
    success: true,
  });

};





