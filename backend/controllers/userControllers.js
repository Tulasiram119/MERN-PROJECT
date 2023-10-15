const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
//For registration
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this ia sample public id",
      url: "profilepic url",
    },
  });
  sendToken(user, 201, res);
});

// for login
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // check if the user given both email and password
  if (!email || !password) {
    return next(new Errorhandler("please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhandler("Invalid credentionals"), 401);
  }
  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid credentionals"), 401);
  }
  sendToken(user, 200, res);
};

// logout user

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logged out" });
});

//forgot password

exports.forgotPassowrd = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhandler("user not found", 404));
  }
  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/password/reset/:${resetToken}`;

  const message = `your password reset token is :- /n/n ${resetPasswordUrl} /n/n if you haven't requested this please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerece password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validationBeforeSave: false });
    return next(new Errorhandler(error.message, 500));
  }
});

//RESET PASSWORD
exports.resetPassowrd = catchAsyncError(async (req, res, next) => {
  // CReaTING TOKEN hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new Errorhandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new Errorhandler("Password does not password", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  sendToken(user, 200, res);
});

//update password
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Old password in incorrect"), 401);
  }
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new Errorhandler("Passwords does not match"), 401);
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});
//change User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

// get all user - admin

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user (admin)
exports.getSingeleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new Errorhandler(`User does not exist with id: ${req.params.id}`),404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});



//update User role -- admin
exports.updateRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if(!user){
    return next(new Errorhandler(`user does not exist with id :${req.params.id}`),400)
  }
  res.status(200).json({ success: true });
});


//to delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new Errorhandler(`user does not exist with id :${req.params.id}`),400)
  }
  await user.deleteOne();
  res.status(200).json({ success: true ,message:"user deleted Sucessfully"},);
});
