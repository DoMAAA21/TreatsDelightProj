const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allProducts,
 newProduct,
 deleteProduct,
 getProductDetails,
 updateProduct,
 updateProductStatus
} = require("../controllers/productController");

const {
  isAuthenticatedUser,

  authorizeRoles,

} = require("../middlewares/auth");


router
  .route("/admin/store/:id/products")
  .get(allProducts);

router.route('/admin/product/:id')
.get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),getProductDetails)
.put(upload.fields([
  { name: 'firstImage', maxCount: 1 }, 
  { name: 'secondImage', maxCount: 1 }, 
  { name: 'thirdImage', maxCount: 1 },  
]), updateProduct)
.delete(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),deleteProduct)

router.post("/admin/product/new", upload.fields([
  { name: 'firstImage', maxCount: 1 }, 
  { name: 'secondImage', maxCount: 1 }, 
  { name: 'thirdImage', maxCount: 1 },  
]), newProduct);

router.route('/admin/product/status/:id').put(updateProductStatus);
module.exports = router;
