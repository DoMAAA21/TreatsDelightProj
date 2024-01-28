const Rent = require("../models/Rent");
const Store = require("../models/Store");


exports.allRents = async (req, res, next) => {
  const rents = await Rent.find({ storeId: { $eq: req.params.id } });;
  res.status(200).json({
    success: true,

    rents,
  });
};


exports.newRent = async (req, res, next) => {
  const { amount, type, note, storeId, issueAt, paidAt } = req.body;
  try {
    const paidDate = (type === "paid") ? paidAt : null;
    const rentAmt = (type === "paid") ? amount : -amount;
    const rent = await Rent.create({
      storeId,
      amount: rentAmt,
      type,
      note,
      issueAt,
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

























