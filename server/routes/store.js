const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

const {
 allStores,
 getStoreDetails,
 updateStore,
 deleteStore,
 newStore
} = require("../controllers/storeController");

// const {
//   isAuthenticatedUser,

//   authorizeRoles,
// } = require("../middlewares/auth");

router
  .route("/admin/stores")
  .get(allStores);


router.route('/admin/store/:id')
  .get(getStoreDetails)
  .put(upload.single("logo"), updateStore)
  .delete(deleteStore);

router.post("/admin/store/new", upload.single("logo"), newStore);





module.exports = router;
