const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
  allRents,
  archivedRents,
  newRent,
  deleteRent,
  restoreRent
} = require("../controllers/rentController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");

router.post("/admin/rent/new", isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), newRent);
router
  .route("/admin/rent/store/:id")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), allRents);

router
  .route("/admin/rent/store/:id/archived")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), archivedRents);

router.route('/admin/rent/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), deleteRent);
router.route('/admin/rent/restore/:id')
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),restoreRent)



module.exports = router;
