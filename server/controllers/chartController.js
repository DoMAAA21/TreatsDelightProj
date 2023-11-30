const Order = require('../models/Order');

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

  
  


