const Electricity = require("../models/Electricity");
const Store = require("../models/Store");


exports.allElectricity = async (req, res, next) => {
  const electricity = await Electricity.find({
    storeId: req.params.id,
    deletedAt: { $eq: null },
  }).sort({ createdAt: -1 });;
  res.status(200).json({
    success: true,

    electricity,
  });
};

exports.archivedElectricity = async (req, res, next) => {
  try {
    const deletedElectricity = await Electricity.find({
      deletedAt: { $ne: null },
      storeId: req.params.id,
    }).sort({ deletedAt: -1 });;

    res.status(200).json({
      success: true,
      electricity: deletedElectricity,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.newElectricity = async (req, res, next) => {
  const { total, additionals, consumed, price, type, note, storeId, issuedAt, paidAt } = req.body;
  try {
    const paidDate = (type === "paid") ? paidAt : null;
    const electricityAmt = (type === "paid") ? total : -total;
    const electricity = await Electricity.create({
      storeId,
      total: electricityAmt,
      additionals,
      consumed,
      price,
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
    store.electricity = (store.electricity ?? 0) + ((type === "paid") ? total : -total);

    await store.save();

    res.status(201).json({
      success: true,
      electricity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Electricity.',
    });
  }
};

exports.deleteElectricity = async (req, res, next) => {
  try {
    const electricity = await Electricity.findById(req.params.id);
    if (!electricity) {
      return next(new ErrorHandler(`Electricity not found with id: ${req.params.id}`));
    }
    electricity.deletedAt = new Date();
    await electricity.save();
    res.status(200).json({
    success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.restoreElectricity = async (req, res, next) => {
  try {
    const { id } = req.body
    const electricity = await Electricity.findById(id);
    if (!electricity) {
      return next(new ErrorHandler(`Electricity not found with id: ${id}`));
    }
    electricity.deletedAt = null;
    await electricity.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};


