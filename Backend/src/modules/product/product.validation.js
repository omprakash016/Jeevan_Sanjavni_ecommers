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

  body("sellingPrice")
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),
];