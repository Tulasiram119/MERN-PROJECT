const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllReviews,
  deleteReview,
} = require("../controllers/productControllers");
const { isAuthenticatedUser, autharizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,autharizeRoles("admin"),createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, autharizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, autharizeRoles("admin"), deleteProduct);
  
router.route("/product/:id").get(getProductDetails);


router.route("/review").put(isAuthenticatedUser,createProductReview)

router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteReview);
module.exports = router;
