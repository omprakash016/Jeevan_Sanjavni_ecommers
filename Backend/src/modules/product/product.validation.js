import { body } from "express-validator";

export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("Mrp")
    .isFloat({ min: 0 })
    .withMessage("MRP must be a positive number"),

  body("SellingPrice")
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),
];


export const updateProductValidation = [
  body("name")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Product name cannot be empty"),
  body("shortDescription")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Short description cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("Mrp")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("MRP must be a positive number"),
  body("SellingPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),
];