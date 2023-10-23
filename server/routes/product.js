const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allProducts
} = require("../controllers/productController");

const {
  isAuthenticatedUser,

  authorizeRoles,
} = require("../middlewares/auth");


router
  .route("/admin/store/:id/products")
  .get(allProducts);




module.exports = router;
