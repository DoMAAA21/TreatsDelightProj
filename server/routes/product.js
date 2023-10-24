const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allProducts,
 newProduct
} = require("../controllers/productController");

const {
  isAuthenticatedUser,

  authorizeRoles,
} = require("../middlewares/auth");


router
  .route("/admin/store/:id/products")
  .get(allProducts);
  
router.post("/admin/product/new", upload.single("image"), newProduct);




module.exports = router;
