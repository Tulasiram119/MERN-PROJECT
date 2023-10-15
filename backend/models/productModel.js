const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: [true,"please enter the product name"],
        trim : true
    },
    description:{
        type: String,
        required: [true,"please enter the product description"]
    },
    price:{
        type: Number,
        type: String,
        required: [true,"please enter the product price"],
        maxLength:[8,"price cannot be more than 8 charaters"]
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required: true
        }
    }],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxLength:[4,"Stock cannot be greater than 4 charaters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:"User",
                required: true
            },
            name:{
                type:String,
                required: true
            },
            rating:{
                type:Number,
                required: true,                
            },
            comment:{
                type:String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("product",productSchema);