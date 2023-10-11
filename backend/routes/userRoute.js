const express = require('express');
const { registerUser, loginUser, logout, forgotPassowrd, resetPassowrd, getUserDetails } = require('../controllers/userControllers');
const router = express.Router();
const { isAuthenticatedUser, autharizeRoles } = require("../middleware/auth");
router.route('/register').post(registerUser);

router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassowrd);
router.route('/password/reset/:token').put(resetPassowrd)
router.route('/logout').get(logout);
router.route('/me').get(isAuthenticatedUser,getUserDetails);
module.exports = router;