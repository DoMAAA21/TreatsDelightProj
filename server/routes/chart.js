const express = require('express')
const router = express.Router();
const { ordersPerMonth,
} = require('../controllers/chartController')

router.route('/chart/orders-per-month').get(ordersPerMonth);

module.exports = router;