import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../constants/orderStatus.js";
const orderItemSchema=new mongoose.Schema(
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },

        name:{
            type:String,
            require:true,
        },

        image:{
            type:String,
            required:true,
        },

        price:{
            type:Number,
            required:true,
        },

        quantity:{
            type:Number,
            required:true,
            min:1,
        },

        subtotal:{
            type:Number,
            required:true,
        },

    },
    {_id:false}
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    address: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      addressType: String,
    },

    totalItems: {
      type: Number,
      required: true,
    },

    totalQuantity: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },

    orderStatus:{
    type:String,
    enum:Object.values(ORDER_STATUS),
    default:ORDER_STATUS.PENDING
},

paymentStatus:{
    type:String,
    enum:Object.values(PAYMENT_STATUS),
    default:PAYMENT_STATUS.PENDING
},
    cancelledAt:{
      type:Date,
      default:null,
    },
    cancelReason:{
      type:String,
      default:null,
    },
    orderNumber: {
      type: String,
       required: true,
       unique: true,
       index: true,
      },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;