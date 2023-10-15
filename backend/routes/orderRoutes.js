const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, autharizeRoles } = require("../middleware/auth");
const {
  newOrder,
  getsingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderContoller");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/order/:id").get(isAuthenticatedUser, getsingleOrder);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, autharizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, autharizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser,autharizeRoles("admin"),deleteOrder);

module.exports = router;
