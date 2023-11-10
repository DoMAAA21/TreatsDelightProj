const upload = require("../utils/multer");

const express = require("express");

const router = express.Router();


const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");

const {
    allEmployees,
    newEmployee
} = require("../controllers/employeeController");


router
  .route("/admin/store/:id/employees")
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),allEmployees);

router.post("/admin/employee/new",isAuthenticatedUser,authorizeRoles('Admin', 'Employee'), upload.single("avatar"), newEmployee);


module.exports = router;
