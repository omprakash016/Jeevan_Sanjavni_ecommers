import express from "express";
import {protect,isAdmin} from "../../middleware/auth.middleware.js";

import {    getAllOrders ,
            getSingleOrder ,
            updateOrderStatus ,
            getDashboardSummary ,
            getRecentOrders,
            getSalesAnalytics,
            getTopSellingProducts , 
            getAllCustomers,
            getSingleCustomer,
            getCustomerOrders} from "./admin.controller.js";

import {  getSingleOrderValidation ,
          updateOrderStatusValidation,
          getCustomerValidation} from "./admin.validation.js"

import {
  getDeletedProducts,
} from "../product/product.controller.js";
 const router = express.Router();

 router.get(
    "/orders",
    protect,
    isAdmin,
    getAllOrders
);

router.get(
    "/orders/:id",
    protect,
    isAdmin,
    getSingleOrderValidation,
    getSingleOrder
);

router.patch(
    "/orders/:id/status",
    protect,
    isAdmin,
    updateOrderStatusValidation,
    updateOrderStatus
);

router.get(
  "/products/deleted",
  protect,
  isAdmin,
  getDeletedProducts
);

router.get(
    "/dashboard",
    protect,
    isAdmin,
    getDashboardSummary
);

router.get(
    "/dashboard/recent-orders",
    protect,
    isAdmin,
    getRecentOrders
);

router.get(
  "/dashboard/sales",
  protect,
  isAdmin,
  getSalesAnalytics
);

router.get(
    "/dashboard/top-products",
    protect,
    isAdmin,
    getTopSellingProducts
);



// Get all customers
router.get(
  "/customers",
  protect,
  isAdmin,
  getAllCustomers
);


// Get single customer
router.get(
  "/customers/:id",
  protect,
  isAdmin,
  getCustomerValidation,
  getSingleCustomer
);


// Get customer's orders
router.get(
  "/customers/:id/orders",
  protect,
  isAdmin,
  getCustomerValidation,
  getCustomerOrders
);

export default router;