const express = require("express");
const router = express.Router();

const {
  allMaintenances,
  archivedMaintenances,
  newMaintenance,
  deleteMaintenance,
  restoreMaintenance
} = require("../controllers/maintenanceController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");

router.post("/admin/maintenance/new", isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), newMaintenance);
router
  .route("/admin/maintenance/store/:id")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), allMaintenances);

router
  .route("/admin/maintenance/store/:id/archived")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), archivedMaintenances);

router.route('/admin/maintenance/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), deleteMaintenance);
router.route('/admin/maintenance/restore')
  .put(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),restoreMaintenance)



module.exports = router;
