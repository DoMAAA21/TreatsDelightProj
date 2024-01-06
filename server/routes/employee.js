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
  .get(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),allEmployees);
   router.route('/admin/employee/:id')
  .get(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),getEmployeeDetails)
  .put(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),upload.single("avatar"),updateEmployee)
  .delete(isAuthenticatedUser,authorizeRoles('Owner', 'Employee'),deleteEmployee);
  
router.post("/admin/employee/new",isAuthenticatedUser,authorizeRoles('Owner', 'Employee'), upload.single("avatar"), newEmployee);


module.exports = router;
