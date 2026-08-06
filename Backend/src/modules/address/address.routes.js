import express from "express";

import { protect } from "../../middleware/auth.middleware.js";

import {
  addAddress,
  getAllAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./address.controller.js";

import {
  addAddressValidation,
  updateAddressValidation,
} from "./address.validation.js";

const router = express.Router();

// Add Address
router.post(
  "/",
  protect,
  addAddressValidation,
  addAddress
);

// Get All Addresses
router.get(
  "/",
  protect,
  getAllAddresses
);

// Get Single Address
router.get(
  "/:id",
  protect,
  getSingleAddress
);

// Update Address
router.patch(
  "/:id",
  protect,
  updateAddressValidation,
  updateAddress
);

// Delete Address
router.delete(
  "/:id",
  protect,
  deleteAddress
);

// Set Default Address
router.patch(
  "/:id/default",
  protect,
  setDefaultAddress
);

export default router;