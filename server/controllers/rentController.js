const Rent = require("../models/Rent");


exports.allRents = async (req, res, next) => {
  const rents = await Rent.find({ storeId: { $eq: req.params.id } });;

  res.status(200).json({
    success: true,

    rents,
  });
};

























