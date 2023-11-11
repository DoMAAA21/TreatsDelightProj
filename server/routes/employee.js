const upload = require("../utils/multer");

const express = require("express");

const router = express.Router();


const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");

const {
    allEmployees,
    newEmployee,
    getEmployeeDetails,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");


router
  .route("/admin/store/:id/employees")
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),allEmployees);
   router.route('/admin/employee/:id')
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),getEmployeeDetails)
  .put(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),upload.single("avatar"),updateEmployee)
  .delete(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),deleteEmployee);
router.post("/admin/employee/new",isAuthenticatedUser,authorizeRoles('Admin', 'Employee'), upload.single("avatar"), newEmployee);


module.exports = router;
