const express = require("express");
const Product = require("../../models/productModel");
const { auth } = require("../../middleware/authMiddleware");
const {
  addProductCtr,
  updateProductCtr,
  getProductList,
  deleteProduct,
  changeProductOrder,
} = require("../../controller/productController");
const {
  createProductValidator,
  updateProductValidator,
  updateProductOrderValidator,
} = require("../../utils/validations/validation");
const upload = require("../../middleware/multerMiddleWare");
const { validateMiddleWare } = require("../../middleware/validationMiddleware");
const router = express.Router();
router.post(
  "/product",
  auth,
  upload,
  // (req, res, next) => {
  //   upload(req, res, (err) => {
  // if (err) {
  //   console.error("error in  multer", err);
  //   if (err.code === "LIMIT_UNEXPECTED_FILE") {
  //     return res.status(400).json({
  //       success: false,
  //       message:
  //         "Expected field named 'image' in multipart/form-data request For File Upload",
  //     });
  //   } else if (err.code === "LIMIT_FILE_SIZE") {
  //     return res.status(413).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   } else {
  //     return res.status(415).json({ success: false, message: err.message });
  //   }
  // }
  // if (!req.file) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please Upload Product Image" });
  // }
  // console.log(req.file);
  // next();
  //   });
  // },
  createProductValidator,
  validateMiddleWare,
  addProductCtr
);
router.put(
  "/product/:id",
  upload,
  // (req, res, next) => {
  //   upload(req, res, (err) => {
  //     if (err) {
  //       if (err.code === "LIMIT_UNEXPECTED_FILE") {
  //         return res.status(400).json({
  //           success: false,
  //           message:
  //             "Expected field named 'image' in multipart/form-data request For File Upload",
  //         });
  //       } else if (err.code === "LIMIT_FILE_SIZE") {
  //         return res.status(413).json({
  //           success: false,
  //           message: err.message,
  //         });
  //       } else {
  //         console.error("error in  multer", err);
  //         return res.status(415).json({ success: false, message: err.message });
  //       }
  //     }
  //     // if (!req.file) {
  //     //   return res
  //     //     .status(400)
  //     //     .json({ success: false, message: "Please Upload Product Image" });
  //     // }
  //     // this is because it is not neccessary to upload image every time
  //     console.log(req.file);
  //     next();
  //   });
  // },
  updateProductValidator,
  auth,
  validateMiddleWare,
  updateProductCtr
);
router.get("/product", auth, getProductList);
router.delete("/product", auth, deleteProduct);
router.put(
  "/product-order",
  updateProductOrderValidator,
  auth,
  validateMiddleWare,
  changeProductOrder
);
router.put("/addFieldOrder", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.body.id,
    {
      order: req.body.order,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json({ success: true, message: "Updateorder success", product: product });
});
module.exports = router;
