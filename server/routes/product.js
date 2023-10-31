const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allProducts,
 newProduct,
 deleteProduct,
 getProductDetails
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
.delete(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),deleteProduct);
  
router.post("/admin/product/new", upload.single("image"), newProduct);


module.exports = router;
