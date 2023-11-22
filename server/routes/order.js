const express = require('express')
const router = express.Router();
const { newOrder,
    // getSingleOrder,
    // myOrders,
    // allOrders,
    // updateOrder,
    // deleteOrder,
    // totalOrders,
	// 	totalSales,
	// 	customerSales,
	// 	salesPerMonth,
    // servicenewOrder

} = require('../controllers/orderController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')



router.route('/order/new').post(newOrder);

module.exports = router;