const express = require("express");
const authRoutes = require("./auth/authRoutes");
const productRoutes = require("./product/productRoutes");
const router = express.Router();
router.use("/api/v1",authRoutes);
router.use("/api/v1",productRoutes);

module.exports = router;
