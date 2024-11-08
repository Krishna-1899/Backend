const {
  updateProduct,
  getProduct,
  createProduct,
  findUserById,
  findProductById,
  deleteProductById,
} = require("../services/productServices");
const fs = require("fs-extra");
require("dotenv").config();
exports.addProductCtr = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please Upload Product Image" });
    }
    console.log("file", req.file);
    const id = req.user.id;
    const { title, description, itemNumber, barcode, price, inventory } =
      req.body;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const existingProduct = user.products.find(
      (product) => product.itemNumber === itemNumber
    );
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Item Number Already exits For User",
      });
    }
    const response = await createProduct({
      title,
      description,
      itemNumber,
      barcode,
      price,
      inventory,
      imageUrl: req.file.path,
      id,
    });
    return res.status(201).json({
      success: true,
      message: "New Product Createded Successfully",
      response,
    });
  } catch (e) {
    console.log("error ", e);
    return res.status(500).json({
      error: e.message,
    });
  }
};
exports.updateProductCtr = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    let newPath;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const product = await findProductById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }
    if (product.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }
    if (req.file) {
      newPath = req.file.path;
      if (fs.existsSync(product.imageUrl)) {
        console.log("removing the old file");
        fs.remove(product.imageUrl)
          .then(() => {
            console.log("file is removed  updation");
          })
          .catch((err) => {
            throw err;
          });
      }
    }
    const { title, description, price, inventory } = req.body;
    let newProduct = {};
    newProduct.title = title || product.title;
    newProduct.description = description || product.description;
    newProduct.imageUrl = newPath != null ? newPath : product.imageUrl;
    newProduct.price = price || product.price;
    newProduct.inventory = inventory || product.inventory;
    const response = await updateProduct({ id, newProduct });

    return res.status(200).json({
      success: true,
      response,
      message: "Product Updated Succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
exports.getProductList = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const response = await getProduct(req, userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await findProductById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }
    const newproduct = await deleteProductById(productId);
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.changeProductOrder = async (req, res) => {
  const { movedId, productThatisDragged, productThatInterChange } = req.body;
  try {
    const oldOrder = productThatisDragged.order;
    if (!oldOrder || !productThatInterChange.order) {
      return res.status(400).json({
        success: false,
        message: "Product Order is Not defined For Product",
      });
    }
    const product = await findProductById(movedId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    const changedProduct = await updateProduct({
      id: movedId,
      newProduct: {
        order: productThatInterChange.order,
      },
    });
    const shiftProduct = await updateProduct({
      id: productThatInterChange._id,
      newProduct: {
        order: oldOrder,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Order Update SuccessFully",
      productThatisDragged: changedProduct,
      productThatInterChange: shiftProduct,
    });
  } catch (err) {
    console.error("Error reordering products:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to reorder products" });
  }
};
