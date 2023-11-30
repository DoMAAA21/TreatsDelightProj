const express = require('express')
const router = express.Router();
const { ordersPerMonth,
    productsSold,
    salesPerMonth
} = require('../controllers/chartController')

router.route('/chart/orders-per-month').get(ordersPerMonth);
router.route('/chart/products-sold').get(productsSold);
router.route('/chart/sales-per-month').get(salesPerMonth);

module.exports = router;