import Product from "./product.model.js";
import { validationResult } from "express-validator";
import { uploadImages } from "../../services/imagekit.service.js";

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    if (req.files.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Maximum 6 images are allowed",
      });
    }

    const {
      name,
      shortDescription,
      description,
      category,
      Mrp,
      sellingPrice,
      stock,
      benefits,
      ingredients,
      directions,
      warnings,
      featured,
      bestSeller,
    } = req.body;

    // Check duplicate product
    const existingProduct = await Product.findOne({
      name: name.trim(),
      isDeleted: false,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Upload images
    const uploadedImages = await uploadImages(req.files);

    // Convert strings to arrays
    const benefitsArray = benefits
      ? benefits.split(",").map((item) => item.trim())
      : [];

    const ingredientsArray = ingredients
      ? ingredients.split(",").map((item) => item.trim())
      : [];

    const product = await Product.create({
      name,
      shortDescription,
      description,
      category,
      Mrp,
      sellingPrice,
      stock,
      benefits: benefitsArray,
      ingredients: ingredientsArray,
      directions,
      warnings,
      featured,
      bestSeller,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};