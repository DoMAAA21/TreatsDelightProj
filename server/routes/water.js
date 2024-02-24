const express = require("express");
const router = express.Router();

const {
  allWaters,
  archivedWaters,
  newWater,
  deleteWater,
  restoreWater
} = require("../controllers/waterController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");

router.post("/admin/water/new", isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), newWater);
router
  .route("/admin/water/store/:id")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), allWaters);

router
  .route("/admin/water/store/:id/archived")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), archivedWaters);

router.route('/admin/water/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), deleteWater);
router.route('/admin/water/restore')
  .put(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),restoreWater)



module.exports = router;
