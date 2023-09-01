const upload = require("../utils/multer");

const express = require("express");

const router = express.Router();

;






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

// const {
//   isAuthenticatedUser,

//   authorizeRoles,
// } = require("../middlewares/auth");

router
  .route("/admin/users")
  .get(allUsers);


router.route('/admin/user/:id')
  .get(getUserDetails)
  .put(upload.single("avatar"),updateUser)
  .delete(deleteUser);
// // router.route("/admin/newuser").post(newUser);

// router.post("/admin/newuser",  upload.array('avatar', 10), newUser);
router.post("/admin/user/new", upload.single("avatar"), newUser);
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
