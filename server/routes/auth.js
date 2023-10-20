const upload = require("../utils/multer");

const express = require("express");

const router = express.Router();


const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth");






const {
    registerUser,

    loginUser,

    logout,
  //   googlelogin,


  //   getUserProfile,

  allUsers,

  //   updateProfile,

  getUserDetails,

  updateUser,

  deleteUser,
  newUser
} = require("../controllers/userController");


router
  .route("/admin/users")
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),allUsers);
router.post("/admin/user/new",isAuthenticatedUser,authorizeRoles('Admin', 'Employee'), upload.single("avatar"), newUser);
router.route('/admin/user/:id')
  .get(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),getUserDetails)
  .put(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),upload.single("avatar"),updateUser)
  .delete(isAuthenticatedUser,authorizeRoles('Admin', 'Employee'),deleteUser);
// // router.route("/admin/newuser").post(newUser);

// router.post("/admin/newuser",  upload.array('avatar', 10), newUser);

// router.put(
//   "/me/update",
//   isAuthenticatedUser,
//   upload.single("avatar"),
//   updateProfile
// );


// router.get("/me", isAuthenticatedUser, getUserProfile);

router.post("/register", registerUser);

router.post("/login", loginUser);

// router.post("/googlelogin", googlelogin);


router.get("/logout",logout);




module.exports = router;
