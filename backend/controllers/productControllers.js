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
  });
});


//create new Review or update existing one

exports.createProductReview = catchAsyncError(async (req,res,next)=>{

  const {rating, comment, productId} = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };
  const product = await Product.findById(productId);


    const isReviewed = product.reviews.find(
      (rev)=>rev.user.toString() === req.user._id.toString());

      if(isReviewed){
        product.reviews.forEach((rev)=>{
          if(rev.user.toString() === req.user._id.toString()){
            rev.rating = rating;
            rev.comment = comment;
          }
        })
      }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }
      let avg = 0;
      product.reviews.forEach((rev)=>{
        avg += rev.rating});

      product.ratings = avg/ product.reviews.length;

      await product.save({validateBeforeSave: false});


      res.status(200).json({sucess:true})
})

//get all reviews of a product

exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new Errorhandler("product not found",404));
  }

  res.status(200).json({
    sucess: true,
    reviews: product.reviews,
  });
})

//deletee an review

exports.deleteReview = catchAsyncError(async(req,res,next)=>{

  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new Errorhandler("Product not found"),404);
  }

  const reviews = product.reviews.filter((rev)=>{
    rev._id.toString() !== req.query.id.toString();
  })
  let avg = 0;
  reviews.forEach((rev)=>{
    avg += rev.rating;
  })
 let ratings = 0;
 if(reviews.length === 0){
  ratings = 0;
 }else{
  ratings = avg/reviews.length;
 }
  const numOfReviews = reviews.length;
  
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,ratings,numOfReviews
  },{
    new:true,
    runValidators :true,
    useFindAndModify: false
  })

  res.status(200).json({success:true});
})