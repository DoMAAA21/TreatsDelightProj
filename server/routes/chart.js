const express = require('express')
const router = express.Router();
const { ordersPerMonth,
    productsSold,
    salesPerMonth,
    electricityBillPerMonth,
    waterBillPerMonth,
    rentBillPerMonth
} = require('../controllers/chartController')

router.route('/chart/orders-per-month').get(ordersPerMonth);
router.route('/chart/products-sold').get(productsSold);
router.route('/chart/sales-per-month').get(salesPerMonth);
router.route('/chart/store/:id/electricity-bill-per-month').get(electricityBillPerMonth);
router.route('/chart/store/:id/water-bill-per-month').get(waterBillPerMonth);
router.route('/chart/store/:id/rent-bill-per-month').get(rentBillPerMonth);

module.exports = router;