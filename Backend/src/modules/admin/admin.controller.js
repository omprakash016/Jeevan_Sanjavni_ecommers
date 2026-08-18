import Order from "../order/order.model.js";
import { validationResult } from "express-validator";
import Product from "../product/product.model.js";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "../../constants/orderStatus.js";
import User from "../auth/user.model.js"

export const getAllOrders = async (req, res) => {
  try {
    // Query Parameters

    const {
      page = 1,
      limit = 10,
      search = "",
      orderStatus,
      paymentStatus,
      paymentMethod,
      sort = "latest",
    } = req.query;

    // Pagination

    const currentPage = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * pageSize;

    // Build Filter

    const filter = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (search.trim()) {
  filter.$or = [
    {
      "address.fullName": {
        $regex: search,
        $options: "i",
      },
    },
    {
      "address.phone": {
        $regex: search,
        $options: "i",
      },
    },
    {
      orderNumber: {
        $regex: search,
        $options: "i",
      },
    },
    ...(search.match(/^[0-9a-fA-F]{24}$/)
      ? [{ _id: search }]
      : []),
  ];
}

    // Sorting

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "amountLow":
        sortOption = { subtotal: 1 };
        break;

      case "amountHigh":
        sortOption = { subtotal: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    // Total Count

    const totalOrders = await Order.countDocuments(filter);

    // Orders

    const orders = await Order.find(filter)
      .select(
        "_id address.fullName address.phone subtotal totalItems totalQuantity paymentMethod paymentStatus orderStatus createdAt"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Pagination

    const totalPages = Math.ceil(totalOrders / pageSize);

    // Response

    return res.status(200).json({
      success: true,

      data: {
        orders,

        pagination: {
          currentPage,
          totalPages,
          totalOrders,
          limit: pageSize,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        },
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



export const getSingleOrder = async (req, res) => {
  try {

    // Validate Request

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    // Find Order

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Response

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

//update order status by order id

export const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    const {
      orderStatus,
      paymentStatus,
    } = req.body;

    // ========================================
    // FIND ORDER
    // ========================================

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    // ========================================
    // MAKE SURE SOMETHING IS BEING UPDATED
    // ========================================

    if (
      orderStatus === undefined &&
      paymentStatus === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide order status or payment status",
      });
    }


    // ========================================
    // UPDATE PAYMENT STATUS
    // ========================================

    if (paymentStatus !== undefined) {

      // Only COD orders can have their
      // payment manually marked successful.

      if (order.paymentMethod !== "COD") {
        return res.status(400).json({
          success: false,
          message:
            "Only COD orders can be manually marked as Successful",
        });
      }


      // Successful payment cannot be changed
      // back to Pending.

      if (
        order.paymentStatus ===
          PAYMENT_STATUS.SUCCESSFUL &&
        paymentStatus ===
          PAYMENT_STATUS.PENDING
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Successful payment cannot be changed back to Pending",
        });
      }


      // If already successful

      if (
        order.paymentStatus ===
          PAYMENT_STATUS.SUCCESSFUL &&
        paymentStatus ===
          PAYMENT_STATUS.SUCCESSFUL
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment is already Successful",
        });
      }


      // Only allow:
      // Pending → Successful

      if (
        order.paymentStatus ===
          PAYMENT_STATUS.PENDING &&
        paymentStatus ===
          PAYMENT_STATUS.SUCCESSFUL
      ) {
        order.paymentStatus =
          PAYMENT_STATUS.SUCCESSFUL;
      }

    }


    // ========================================
    // UPDATE ORDER STATUS
    // ========================================

    if (orderStatus !== undefined) {

      // Same status check

      if (
        order.orderStatus === orderStatus
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Order is already ${orderStatus}`,
        });
      }


      // Allowed Status Transitions

      const allowedTransitions = {

        [ORDER_STATUS.PENDING]: [
          ORDER_STATUS.CONFIRMED,
          ORDER_STATUS.CANCELLED,
        ],

        [ORDER_STATUS.CONFIRMED]: [
          ORDER_STATUS.PROCESSING,
          ORDER_STATUS.CANCELLED,
        ],

        [ORDER_STATUS.PROCESSING]: [
          ORDER_STATUS.SHIPPED,
          ORDER_STATUS.CANCELLED,
        ],

        [ORDER_STATUS.SHIPPED]: [
          ORDER_STATUS.DELIVERED,
        ],

        [ORDER_STATUS.DELIVERED]: [],

        [ORDER_STATUS.CANCELLED]: [],
      };


      const isAllowed =
        allowedTransitions[
          order.orderStatus
        ]?.includes(orderStatus);


      if (!isAllowed) {
        return res.status(400).json({
          success: false,
          message:
            `Cannot change order status from "${order.orderStatus}" to "${orderStatus}"`,
        });
      }


      // Update order status

      order.orderStatus = orderStatus;


      // ========================================
      // COD + DELIVERED
      // AUTOMATICALLY MARK PAYMENT SUCCESSFUL
      // ========================================

      if (
        order.paymentMethod === "COD" &&
        orderStatus ===
          ORDER_STATUS.DELIVERED
      ) {
        order.paymentStatus =
          PAYMENT_STATUS.SUCCESSFUL;
      }

    }


    // ========================================
    // SAVE
    // ========================================

    await order.save();


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message:
        paymentStatus !== undefined &&
        orderStatus === undefined
          ? "Payment status updated successfully"
          : "Order updated successfully",

      data: {
        order,
      },
    });

  } catch (error) {

    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//Dashboard statistics for admin


export const getDashboardSummary = async (req, res) => {
  try {

    const [
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      lowStockProducts,
      revenueResult,
    ] = await Promise.all([

      // Total Orders
      Order.countDocuments(),

      // Total Users
      User.countDocuments(),

      // Total Products
      Product.countDocuments(),

      // Pending Orders
      Order.countDocuments({
        orderStatus: ORDER_STATUS.PENDING,
      }),

      // Delivered Orders
      Order.countDocuments({
        orderStatus: ORDER_STATUS.DELIVERED,
      }),

      // Cancelled Orders
      Order.countDocuments({
        orderStatus: ORDER_STATUS.CANCELLED,
      }),

      // Low Stock Products
      Product.countDocuments({
        stock: {
          $lte: 10,
        },
      }),

      // Total Revenue
      Order.aggregate([
        {
          $match: {
            orderStatus: ORDER_STATUS.DELIVERED,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$subtotal",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,

      data: {

        totalRevenue,

        totalOrders,

        totalUsers,

        totalProducts,

        pendingOrders,

        completedOrders,

        cancelledOrders,

        lowStockProducts,

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


//Recent orders


export const getRecentOrders = async (req, res) => {
  try {

    const recentOrders = await Order.find()
      .select(
        "orderNumber address.fullName subtotal paymentMethod paymentStatus orderStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        recentOrders,
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

//Sales analytics for admin


export const getSalesAnalytics = async (req, res) => {
  try {

    const [dailySales, monthlySales, yearlySales] = await Promise.all([

      // Daily Sales
      Order.aggregate([
        {
          $match: {
            orderStatus: ORDER_STATUS.DELIVERED,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalRevenue: {
              $sum: "$subtotal",
            },
            totalOrders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
            "_id.day": -1,
          },
        },
        {
          $limit: 7,
        },
      ]),

      // Monthly Sales
      Order.aggregate([
        {
          $match: {
            orderStatus: ORDER_STATUS.DELIVERED,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalRevenue: {
              $sum: "$subtotal",
            },
            totalOrders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
          },
        },
      ]),

      // Yearly Sales
      Order.aggregate([
        {
          $match: {
            orderStatus: ORDER_STATUS.DELIVERED,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
            },
            totalRevenue: {
              $sum: "$subtotal",
            },
            totalOrders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": -1,
          },
        },
      ]),

    ]);

    return res.status(200).json({
      success: true,
      data: {
        dailySales,
        monthlySales,
        yearlySales,
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

//best selling products


export const getTopSellingProducts = async (req, res) => {
  try {

    const topProducts = await Order.aggregate([

      // Only Delivered Orders
      {
        $match: {
          orderStatus: ORDER_STATUS.DELIVERED,
        },
      },

      // Break items array
      {
        $unwind: "$items",
      },

      // Group by Product
      {
        $group: {
          _id: "$items.product",

          totalSold: {
            $sum: "$items.quantity",
          },

          totalRevenue: {
            $sum: "$items.subtotal",
          },
        },
      },

      // Highest Selling First
      {
        $sort: {
          totalSold: -1,
        },
      },

      // Top 10
      {
        $limit: 10,
      },

      // Product Details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      // Required Fields
      {
        $project: {
          _id: 0,

          productId: "$product._id",

          productName: "$product.name",

          image: {
            $arrayElemAt: [
              "$product.images.url",
              0,
            ],
          },

          category: "$product.category",

          totalSold: 1,

          totalRevenue: 1,

          currentStock: "$product.stock",
        },
      },

    ]);

    return res.status(200).json({
      success: true,

      data: {
        topProducts,
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