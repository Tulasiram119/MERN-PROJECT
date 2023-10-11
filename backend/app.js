const express = require('express');
const cookieParser = require('cookie-parser');

const errMiddleware = require('./middleware/error');
const app = express();
app.use(express.json());
app.use(cookieParser());

//route imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const Errorhandler = require('./utils/errorHandler');
app.use("/api/v1",product);
app.use('/api/v1',user);
app.all('*',(req,res,next)=>{
    next(new Errorhandler("invalid path",400));
})




//error middleware
app.use(errMiddleware);

module.exports = app;