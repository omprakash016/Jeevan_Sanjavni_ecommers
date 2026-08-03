import express from "express";
import { register, login,
  logout, } from "./auth.controller.js";
import { registerValidation } from "./auth.validation.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", login);
router.post("/logout", logout);
export default router;