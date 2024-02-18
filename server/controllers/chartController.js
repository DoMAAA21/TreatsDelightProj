const Order = require('../models/Order');
const mongoose = require("mongoose");
const Electricity = require('../models/Electricity');
const Water = require('../models/Water');
const Rent = require('../models/Rent');
const { ObjectId } = mongoose.Types;

exports.ordersPerMonth = async (req, res, next) => {
  try {
    const salesData = await Order.aggregate([
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            order: '$_id',
          },
          totalOrderItems: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          totalOrderItems: { $sum: '$totalOrderItems' },
        },
      },
      {
        $sort: {
          '_id': 1,
        },
      },
    ]);

    res.json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.productsSold = async (req, res, next) => {
  try {
    const salesData = await Order.aggregate([
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: '$orderItems.name',
          totalProductsSold: { $sum: '$orderItems.quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          value: '$totalProductsSold',
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
      {
        $facet: {
          topProducts: [
            { $limit: 5 }, // Take the top 5 products
          ],
          others: [
            { $skip: 5 }, // Skip the top 5 products
          ],
        },
      },
      {
        $project: {
          data: {
            $concatArrays: ['$topProducts', [{ label: 'Others', value: { $sum: '$others.value' } }]],
          },
        },
      },
    ]);

    res.json(salesData[0].data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.salesPerMonth = async (req, res, next) => {
  try {
    const salesData = await Order.aggregate([
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            order: '$_id',
          },
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          totalSales: { $sum: '$totalSales' },
        },
      },
      {
        $sort: {
          '_id': 1,
        },
      },
    ]);

    res.json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.electricityBillPerMonth = async (req, res, next) => {
  const { id } = req.params;
  const storeId = new ObjectId(id);
  try {
    const billData = await Electricity.aggregate([
      {
        $match: {
          storeId: storeId,
          deletedAt: null
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' }, // Extract year
            month: { $month: '$issuedAt' } // Extract month
          },
          totalBill: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year', // Project year
          month: '$_id.month', // Project month
          totalBill: 1
        }
      },
      {
        $sort: { // Sort by year and month
          year: 1,
          month: 1
        }
      }
    ]);

    res.json(billData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.waterBillPerMonth = async (req, res, next) => {
  const { id } = req.params;
  const storeId = new ObjectId(id);
  try {
    const billData = await Water.aggregate([
      {
        $match: {
          storeId: storeId,
          deletedAt: null
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' }, // Extract year
            month: { $month: '$issuedAt' } // Extract month
          },
          totalBill: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year', // Project year
          month: '$_id.month', // Project month
          totalBill: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);

    res.json(billData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.rentBillPerMonth = async (req, res, next) => {
  const { id } = req.params;
  const storeId = new ObjectId(id);
  try {
    const billData = await Rent.aggregate([
      {
        $match: {
          storeId: storeId,
          deletedAt: null
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' }, // Extract year
            month: { $month: '$issuedAt' } // Extract month
          },
          totalBill: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year', // Project year
          month: '$_id.month', // Project month
          totalBill: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);

    res.json(billData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.storeProductsSold = async (req, res, next) => {
  const { id } = req.params;
  const storeId = new ObjectId(id);
  try {
    const salesData = await Order.aggregate([
      {
        $unwind: '$orderItems',
      },
      {
        $match: {
          'orderItems.storeId': storeId,
        }
      },
      {
        $group: {
          _id: '$orderItems.name',
          totalProductsSold: { $sum: '$orderItems.quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          value: '$totalProductsSold',
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
      {
        $facet: {
          topProducts: [
            { $limit: 5 }, // Take the top 5 products
          ],
          others: [
            { $skip: 5 }, // Skip the top 5 products
          ],
        },
      },
      {
        $project: {
          data: {
            $concatArrays: ['$topProducts', [{ label: 'Others', value: { $sum: '$others.value' } }]],
          },
        },
      },
    ]);

    res.json(salesData[0].data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};











