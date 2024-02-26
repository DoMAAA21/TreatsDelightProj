const express = require('express')
const router = express.Router();
const { ordersPerMonth,
    productsSold,
    salesPerMonth,
    electricityBillPerMonth,
    waterBillPerMonth,
    rentBillPerMonth,
    storeProductsSold,
    topStores,
    storeSalesCurrentMonth,
    storeSalesCurrentDay
} = require('../controllers/chartController')

router.route('/chart/orders-per-month').get(ordersPerMonth);
router.route('/chart/products-sold').get(productsSold);
router.route('/chart/sales-per-month').get(salesPerMonth);
router.route('/chart/store/:id/electricity-bill-per-month').get(electricityBillPerMonth);
router.route('/chart/store/:id/water-bill-per-month').get(waterBillPerMonth);
router.route('/chart/store/:id/rent-bill-per-month').get(rentBillPerMonth);
router.route('/chart/store/:id/products-sold').get(storeProductsSold);
router.route('/chart/store/:id/sales-current-month').get(storeSalesCurrentMonth);
router.route('/chart/store/:id/sales-current-day').get(storeSalesCurrentDay);
router.route('/chart/top-stores').get(topStores);

module.exports = router;