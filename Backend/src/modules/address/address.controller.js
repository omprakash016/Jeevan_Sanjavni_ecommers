import { validationResult } from "express-validator";
import Address from "./address.model.js";

export const addAddress = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const userId = req.user.id;

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType,
    } = req.body;

    // Check if this is the user's first address
    const addressCount = await Address.countDocuments({
      user: userId,
    });

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country: country || "India",
      addressType: addressType || "Home",
      isDefault: addressCount === 0,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        address,
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


//get all adresses


export const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId })
      .sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: {
        addresses,
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

//get single address
export const getSingleAddress = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      _id: id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        address,
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


//update address



export const updateAddress = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      _id: id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType,
    } = req.body;

    if (fullName !== undefined) 
        address.fullName = fullName;
    if (phone !== undefined) 
        address.phone = phone;
    if (addressLine1 !== undefined)
         address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined)
         address.addressLine2 = addressLine2;
    if (landmark !== undefined)
         address.landmark = landmark;
    if (city !== undefined) 
        address.city = city;
    if (state !== undefined)
         address.state = state;
    if (postalCode !== undefined)
         address.postalCode = postalCode;
    if (country !== undefined) 
        address.country = country;
    if (addressType !== undefined) 
        address.addressType = addressType;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
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

//Delete Address

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({
      _id: id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    // If deleted address was default,
    // assign another address as default.
    if (wasDefault) {

      const anotherAddress = await Address.findOne({
        user: userId,
      }).sort({ createdAt: 1 });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }

    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//set Default Address

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find Address
    const address = await Address.findOne({
      _id: id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Already Default
    if (address.isDefault) {
      return res.status(200).json({
        success: true,
        message: "Address is already the default address",
        data: {
          address,
        },
      });
    }

    // Remove default from all user's addresses
    await Address.updateMany(
      { user: userId },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    // Set selected address as default
    address.isDefault = true;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: {
        address,
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