import { body ,param} from "express-validator";

export const addAddressValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal Code is required")
    .isPostalCode("IN")
    .withMessage("Invalid Postal Code"),

  body("country")
    .optional()
    .trim(),

  body("addressType")
    .optional()
    .isIn(["Home", "Office", "Other"])
    .withMessage("Invalid address type"),
];



export const getSingleAddressValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Address ID"),
];


export const updateAddressValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("addressLine1")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 cannot be empty"),

  body("addressLine2")
    .optional()
    .trim(),

  body("landmark")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),

  body("postalCode")
    .optional()
    .trim()
    .isPostalCode("IN")
    .withMessage("Invalid postal code"),

  body("country")
    .optional()
    .trim(),

  body("addressType")
    .optional()
    .isIn(["Home", "Office", "Other"])
    .withMessage("Invalid address type"),
];