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

