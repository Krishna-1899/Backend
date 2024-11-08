const express = require("express");
const { signUp, login } = require("../../controller/authController");
const {
  loginValidator,
  createValidator,
} = require("../../utils/validations/validation");
const { auth } = require("../../middleware/authMiddleware");
const { validateMiddleWare } = require("../../middleware/validationMiddleware");
const router = express.Router();
router.post("/signup", createValidator, auth, validateMiddleWare, signUp);
router.post("/login", loginValidator, auth, validateMiddleWare, login);

module.exports = router;
