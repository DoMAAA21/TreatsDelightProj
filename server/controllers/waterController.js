const Water = require("../models/Water");
const Store = require("../models/Store");


exports.allWaters = async (req, res, next) => {
  const waters = await Water.find({
    storeId: req.params.id,
    deletedAt: { $eq: null },
  }).sort({ createdAt: -1 });;
  res.status(200).json({
    success: true,

    waters,
  });
};

exports.archivedWaters = async (req, res, next) => {
  try {
    const deletedWaters = await Water.find({
      deletedAt: { $ne: null },
      storeId: req.params.id,
    }).sort({ deletedAt: -1 });;

    res.status(200).json({
      success: true,
      waters: deletedWaters,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.newWater = async (req, res, next) => {
  const { total, additionals, consumed, price, type, note, storeId, issuedAt, paidAt } = req.body;
  try {
    const paidDate = (type === "paid") ? paidAt : null;
    const waterAmt = (type === "paid") ? total : -total;
    const water = await Water.create({
      storeId,
      total: waterAmt,
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
    store.water = (store.water ?? 0) + ((type === "paid") ? total : -total);

    await store.save();

    res.status(201).json({
      success: true,
      water,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Water.',
    });
  }
};

exports.deleteWater = async (req, res, next) => {
  try {
    const water = await Water.findById(req.params.id);
    if (!water) {
      return next(new ErrorHandler(`Water not found with id: ${req.params.id}`));
    }
    water.deletedAt = new Date();
    await water.save();
    res.status(200).json({
    success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

exports.restoreWater = async (req, res, next) => {
  try {
    const { id } = req.body
    const water = await Water.findById(id);
    if (!water) {
      return next(new ErrorHandler(`Water not found with id: ${id}`));
    }
    water.deletedAt = null;
    await water.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Internal Server Error'));
  }
};

























