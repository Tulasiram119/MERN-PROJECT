const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassowrd,
  resetPassowrd,
  getUserDetails,
  changePassword,
  updateProfile,
  getAllUsers,
  getSingeleUser,
  updateRole,
  deleteUser,
} = require("../controllers/userControllers");
const router = express.Router();
const { isAuthenticatedUser, autharizeRoles } = require("../middleware/auth");
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassowrd);
router.route("/password/reset/:token").put(resetPassowrd);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, changePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, autharizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, autharizeRoles("admin"), getSingeleUser)
  .put(isAuthenticatedUser, autharizeRoles("admin"),updateRole)
  .delete(isAuthenticatedUser, autharizeRoles("admin"),deleteUser);

module.exports = router;
