import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { generateOrderNumber } from "../../utils/generateOrderNumber.js";
import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import Address from "../address/address.model.js";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const orderNumber = await generateOrderNumber(session);
    // Validate Request

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    const { addressId } = req.body;

    // Verify Address

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    }).session(session);

    if (!address) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Get Cart

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Validate Products

    const orderItems = [];

    let totalItems = 0;
    let totalQuantity = 0;
    let subtotal = 0;

    for (const item of cart.items) {

      const product = item.product;

      if (!product || product.isDeleted) {

        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: "One or more products are unavailable.",
        });
      }

      if (product.stock < item.quantity) {

        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} items left.`,
        });
      }

      const itemSubtotal = product.SellingPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image:
          product.images && product.images.length > 0
            ? product.images[0].url
            : "",

        price: product.SellingPrice,

        quantity: item.quantity,

        subtotal: itemSubtotal,
      });

      totalItems += 1;
      totalQuantity += item.quantity;
      subtotal += itemSubtotal;
    }

    const order = await Order.create(
      [
        {

          orderNumber: orderNumber,  
          user: userId,

          items: orderItems,

          address: {
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            addressType: address.addressType,
          },

          totalItems,
          totalQuantity,
          subtotal,

          paymentMethod: "COD",
          paymentStatus: "Pending",
          orderStatus: "Pending",
        },
      ],
      { session }
    );

    // Reduce Product Stock

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        { session }
      );
    }

    // Clear Cart

    cart.items = [];
    await cart.save({ session });

    // Commit Transaction

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order: order[0],
      },
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

   const orders = await Order.find({ user: userId })
  .select(
    "_id totalItems totalQuantity subtotal paymentMethod paymentStatus orderStatus createdAt"
  )
  .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        orders,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//get order details by order id

export const getOrderDetails = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Find order belonging to logged-in user
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//cancel orders
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Validate Request

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.id;


    // Find Order

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================
    // Already Cancelled
    // ==========================

    if (order.orderStatus === "Cancelled") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Check Order Status

    const allowedStatuses = ["Pending", "Confirmed"];

    if (!allowedStatuses.includes(order.orderStatus)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is ${order.orderStatus}.`,
      });
    }

    // Check 2-Day Cancellation Window


    const cancellationDeadline = new Date(order.createdAt);
    cancellationDeadline.setDate(cancellationDeadline.getDate() + 2);

    if (new Date() > cancellationDeadline) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Orders can only be cancelled within 2 days of placing the order.",
      });
    }

    // Restore Product Stock

    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.product,
        },
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        }
      );
    }

    
    // Update Order


    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = "Cancelled by customer";

    await order.save({ session });

    // Commit Transaction

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        order,
      },
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};