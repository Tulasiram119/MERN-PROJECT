const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String,
            required: true },

    city: { type: String,
            required: true },

    state: { type: String,
            required: true },

    country: { type: String,
            required: true },

    pincode: { type: Number,
            required: true },

    phoneNumber: { type: Number,
            required: true },
  },
  orderItems:[
    {
    name: { type: String,
        required: true },
    
    price: { type: Number,
            required: true },

    quantity: { type: Number,
        required: true },

    image: { type: String,
        required: true },
    product:{
       type: mongoose.Schema.ObjectId,
       ref: "Product",
       required: true 
        }
    },
    
  ],
  user:{
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },
  paymentInfo:{
    id:{ type: String,
        required: true },
    
    status:{
        type: String,
        required: true}
    },
    paidAt:{
        type: Date,
        required: true,
    },
    itemPrice:{
        type: Number,
        default: 0,
        requied: true
    },
    taxPrice:{
        type: Number,
        default: 0,
        requied: true
    },
    shippingPrice:{
        type: Number,
        default: 0,
        requied: true
    },
    totalPrice:{
        type: Number,
        default: 0,
        requied: true
    },
    orderStatus:{
        type: String,
        requied: true,
        default: "processing"
    },
    deliveredAt: Date,
    createdAt:{
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model("Order",orderSchema);