import express from "express";
import {protect,isAdmin} from "../../middleware/auth.middleware.js";
import { getAllOrders ,getSingleOrder ,updateOrderStatus ,getDashboardSummary ,getRecentOrders,getSalesAnalytics,getTopSellingProducts } from "./admin.controller.js";
import {  getSingleOrderValidation ,updateOrderStatusValidation} from "./admin.validation.js"
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
export default router;