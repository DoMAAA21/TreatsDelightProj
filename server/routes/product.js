const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allProducts,
 newProduct,
 deleteProduct,
 getProductDetails,
 updateProduct,
 updateProductStatus,
 allMeals,
 allItems,
 updateStocks,
 allItemsWeb
} = require("../controllers/productController");

const {
  isAuthenticatedUser,

  authorizeRoles,

} = require("../middlewares/auth");


router.get("/admin/store/:id/products",isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),allProducts);
router.get("/admin/store/:id/meals",isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),allMeals);
router.get("/allItems",allItems);
router.get("/allItemsWeb",allItemsWeb);

router.route('/admin/product/:id')
.get(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),getProductDetails)
.put(upload.fields([
  { name: 'firstImage', maxCount: 1 }, 
  { name: 'secondImage', maxCount: 1 }, 
  { name: 'thirdImage', maxCount: 1 },  
]), updateProduct)
.delete(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),deleteProduct)

router.post("/admin/product/new", upload.fields([
  { name: 'firstImage', maxCount: 1 }, 
  { name: 'secondImage', maxCount: 1 }, 
  { name: 'thirdImage', maxCount: 1 },  
]), newProduct);

router.route('/product/:id')
.get(getProductDetails)

router.route('/admin/product/status/:id').put(updateProductStatus);
router.route('/admin/product/update-stocks').patch(updateStocks);
module.exports = router;
