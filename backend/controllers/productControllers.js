const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatutres = require("../utils/apiFeatures");
//get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatutres(Product.find(), req.query)
    .search()
    .filter()
    .pagiantion(resultPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    sucess: true,
    products,
    
  });
});
//creating product ---Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    sucess: true,
    product,
  });
});
// updating the product -- admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    sucess: true,
    product,
  });
});
// deleting the product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  product = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ sucess: true, message: "Deleted Succesfully" });
});
//get single product
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    sucess: true,
    product,
    productCount
  });
});
