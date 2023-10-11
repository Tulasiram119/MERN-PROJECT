const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productControllers");
const { isAuthenticatedUser, autharizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,createProduct);
router
  .route("/product/:id")
  .put(isAuthenticatedUser, autharizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, autharizeRoles("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
