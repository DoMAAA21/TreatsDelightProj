const upload = require("../utils/multer");

const express = require("express");

const router = express.Router();


const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");






const {
  verifyToken,
  registerUser,
  loginUser,
  logout,
  allUsers,
  allOwners,
  updateProfile,
  getUserDetails,
  updateUser,
  deleteUser,
  newUser
} = require("../controllers/userController");

router.post("/verify-token", verifyToken);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee', 'Owner'), allUsers);
router.get("/admin/owners",isAuthenticatedUser, authorizeRoles('Admin'), allOwners);


router.post("/admin/user/new", isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), upload.single("avatar"), newUser);
router.route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), upload.single("avatar"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles('Admin', 'Employee'), deleteUser);

router.route('/edit-profile/:id')
  .put(upload.single("avatar"), updateProfile);


router.post("/register", registerUser);

router.post("/login", loginUser);




router.get("/logout", logout);




module.exports = router;
