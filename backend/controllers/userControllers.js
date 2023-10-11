const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
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
  await user.save({ validationBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/password/reset/:${resetToken}`;

  const message = `your password reset token is :- /n/n ${resetPasswordUrl} /n/n if you haven't requested this please ignore it`;
  
  
  try {
    await sendEmail({
      email: user.email,
      subject :"Ecommerece password recovery",
      message,
    })
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validationBeforeSave: false });
    return next(new Errorhandler(error.message,500));
  }
});


//RESET PASSWORD
exports.resetPassowrd = catchAsyncError(async (req, res, next) => {

  // CRATING TOKEN hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
  if (!user) {
    return next(new Errorhandler("reset token is not found or expired", 404));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new Errorhandler("passwords does not match", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user,200,res);
})

//get user details

exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id);

  sendToken(user,200,res);
})



exports.changePassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Old password in incorrect"), 401);
  }
  if(req.body.newPassword != req.body.confirmPassword){
    return next(new Errorhandler("Passwords does not match"), 401);
  }
  user.password = req.body.newPassword;
  await user.save();
})
