import Product from "./product.model.js";
import { validationResult  } from "express-validator";
import { uploadImages , deleteImages, } from "../../services/imagekit.service.js";

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
      SellingPrice,
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
      SellingPrice,
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
      data: {
          product,
       },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all products

export const getAllProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      featured,
      bestSeller,
      sort = "newest",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {
      isDeleted: false,
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (bestSeller === "true") {
      query.bestSeller = true;
    }

    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = { SellingPrice: 1 };
        break;

      case "priceHigh":
        sortOption = { SellingPrice: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
      products,
      pagination: {
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      limit,
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

//get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        product,
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


//update product

export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      shortDescription,
      description,
      category,
      Mrp,
      SellingPrice,
      stock,
      benefits,
      ingredients,
      directions,
      warnings,
      featured,
      bestSeller,
      keepImages,
    } = req.body;

    // Check duplicate product name
    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({
        name: name.trim(),
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }
    }

    // Update basic fields


    if (name !== undefined) product.name = name;

    if (shortDescription !== undefined)
      product.shortDescription = shortDescription;

    if (description !== undefined)
      product.description = description;

    if (category !== undefined)
      product.category = category;

    if (Mrp !== undefined)
      product.Mrp = Mrp;

    if (SellingPrice !== undefined)
      product.SellingPrice = SellingPrice;

    if (stock !== undefined)
      product.stock = stock;

    if (benefits !== undefined) {
      product.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split(",").map((item) => item.trim());
    }

    if (ingredients !== undefined) {
      product.ingredients = Array.isArray(ingredients)
        ? ingredients
        : ingredients.split(",").map((item) => item.trim());
    }

    if (directions !== undefined)
      product.directions = directions;

    if (warnings !== undefined)
      product.warnings = warnings;

    if (featured !== undefined)
      product.featured = featured === "true" || featured === true;

    if (bestSeller !== undefined)
      product.bestSeller = bestSeller === "true" || bestSeller === true;

    // ----------------------------
    // Update Images (Only if needed)
    // ----------------------------

    if (keepImages !== undefined || (req.files && req.files.length > 0)) {

      let keepImageIds = [];

      if (keepImages) {
        keepImageIds =
          typeof keepImages === "string"
            ? JSON.parse(keepImages)
            : keepImages;
      }

      const remainingImages = product.images.filter((image) =>
        keepImageIds.includes(image.fileId)
      );

      const removedFileIds = product.images
        .filter((image) => !keepImageIds.includes(image.fileId))
        .map((image) => image.fileId);

      if (removedFileIds.length > 0) {
        await deleteImages(removedFileIds);
      }

      let uploadedImages = [];

      if (req.files && req.files.length > 0) {
        uploadedImages = await uploadImages(req.files);
      }

      const updatedImages = [...remainingImages, ...uploadedImages];

      if (updatedImages.length < 1 || updatedImages.length > 6) {
        return res.status(400).json({
          success: false,
          message: "Product must have between 1 and 6 images",
        });
      }

      product.images = updatedImages;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
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


//delete controller

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product || product.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.isDeleted = true;
        product.deletedAt = new Date();

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (!product.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Product is already active",
            });
        }

        product.isDeleted = false;
        product.deletedAt = null;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product restored successfully",
            data: {
                product,
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


export const getDeletedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Deleted products fetched successfully",
      data: {
        products,
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