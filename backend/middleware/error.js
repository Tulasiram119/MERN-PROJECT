const Errorhandler = require("../utils/errorHandler");

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "internal server error";
    // wrong mongo id
    if(error.name === 'CastError'){
        const message = `Resource not found ${error.path}`
        error = new Errorhandler(message,400);
    }
    //duplicate email entered
    if(error.code === 11000){
        const message = `Duplicte ${Object.keys(error.keyValue)} entered`
        error = new Errorhandler(message,400);
    }
    // wrong jsonweb token
    if(error.name === "JsonWebTokenError"){
        const message = `Json web token is invalid try agian`
        error = new Errorhandler(message,400);
    }
    // jwt expire error
    if(error.name === "TokenExpiredError"){
        const message = `Json web token is expired try agian`
        error = new Errorhandler(message,400);
    }
    res.status(error.statusCode).json({success: false,message:error.message});
}