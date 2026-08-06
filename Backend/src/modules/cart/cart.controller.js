import { validationResult } from "express-validator";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const addToCart = async (req, res) => {
  try {
    // Validate Request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Check Product
    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check Product Stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // Find User Cart
    let cart = await Cart.findOne({ user: userId });

    // Create Cart if not exists
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // Check if Product already exists in Cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + Number(quantity);

      if (updatedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) available in stock`,
        });
      }

      existingItem.quantity = updatedQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug shortDescription Mrp SellingPrice stock images featured bestSeller",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cart,
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


//get cart items

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select:
        "name slug Mrp SellingPrice stock images isDeleted",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
        },
      });
    }

    // Remove deleted products
    const validItems = cart.items.filter(
      (item) => item.product && !item.product.isDeleted
    );

    let subtotal = 0;
    let totalQuantity = 0;

    const items = validItems.map((item) => {
      const itemTotal =
        item.product.SellingPrice * item.quantity;

      subtotal += itemTotal;
      totalQuantity += item.quantity;

      return {
        productId: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        image:
          item.product.images.length > 0
            ? item.product.images[0].url
            : null,
        Mrp: item.product.Mrp,
        SellingPrice: item.product.SellingPrice,
        stock: item.product.stock,
        quantity: item.quantity,
        itemTotal,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        items,
        totalItems: items.length,
        totalQuantity,
        subtotal,
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


export const updateCart = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Check Product
    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check Stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // Find Cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find Item
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update Quantity
    cartItem.quantity = Number(quantity);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: {
        cart,
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

//remove cart item

export const removeCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Clear Cart

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is already empty",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};