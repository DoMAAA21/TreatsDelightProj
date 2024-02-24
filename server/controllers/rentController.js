const Rent = require("../models/Rent");
const Store = require("../models/Store");


exports.allRents = async (req, res, next) => {
  const rents = await Rent.find({
    storeId: req.params.id,
    deletedAt: { $eq: null },
  }).sort({ createdAt: -1 });;
  res.status(200).json({
    success: true,

    rents,
  });
};

exports.archivedRents = async (req, res, next) => {
  try {
    const deletedRents = await Rent.find({
      deletedAt: { $ne: null },
      storeId: req.params.id,
    }).sort({ deletedAt: -1 });;

    res.status(200).json({
      success: true,
      rents: deletedRents,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.newRent = async (req, res, next) => {
  const { amount, type, note, storeId, issuedAt, paidAt } = req.body;
  try {
    const paidDate = (type === "paid") ? paidAt : null;
    const rentAmt = (type === "paid") ? amount : -amount;
    const rent = await Rent.create({
      storeId,
      amount: rentAmt,
      type,
      note,
      issuedAt,
      paidAt: paidDate
    });

    const store = await Store.findOne({ _id: storeId });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }
    store.rent = (store.rent ?? 0) + ((type === "paid") ? amount : -amount);

    await store.save();

    res.status(201).json({
      success: true,
      rent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Rent.',
    });
  }
};

exports.deleteRent = async (req, res, next) => {
  try {
    const rent = await Rent.findById(req.params.id);
    if (!rent) {
      return next(new ErrorHandler(`Rent not found with id: ${req.params.id}`));
    }
    rent.deletedAt = new Date();
    await rent.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.restoreRent = async (req, res, next) => {
  try {
    const { id } = req.body
    const rent = await Rent.findById(id);
    if (!rent) {
      return next(new ErrorHandler(`Rent not found with id: ${id}`));
    }
    rent.deletedAt = null;
    await rent.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

