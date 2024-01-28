const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allRents,
 newRent
} = require("../controllers/rentController");

const {
  isAuthenticatedUser,

  authorizeRoles,
} = require("../middlewares/auth");

router.post("/admin/rent/new",isAuthenticatedUser,authorizeRoles('Admin', 'Employee'), newRent);
router
  .route("/admin/rent/store/:id")
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),allRents);




module.exports = router;
