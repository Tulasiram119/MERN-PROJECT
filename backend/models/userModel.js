const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "The length of name shouldn't exceed 30 charaters"],
    minLength: [5, "Name should be atleast 5 charaters length"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validator: [validator.isEmail, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [8, "your password should have minimum 8 charaters length"],
    
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//JWT token
userSchema.methods.JWTToken = function () {  
  return  jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// reset password
userSchema.methods.getResetPasswordToken = function () {
  //creating a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //creating a hashing and resetpassword token to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
