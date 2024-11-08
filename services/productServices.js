const Product = require("../models/productModel");
const User = require("../models/userModel");
const fs = require("fs-extra");
const path = require("path");
exports.findUserById = async (id) => {
  const user = await User.findById(id).populate({ path: "products" }).exec();
  return user;
};
exports.findProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};
exports.findProduct = async (data) => {
  const product = await Product.findOne(data);
  return product;
};
exports.createProduct = async ({
  id,
  title,
  description,
  itemNumber,
  barcode,
  imageUrl,
  price,
  inventory,
}) => {
  const productCount = await Product.countDocuments();
  const newProduct = await Product.create({
    title,
    description,
    itemNumber,
    barcode,
    imageUrl,
    price,
    inventory,
    order: productCount + 1,
    user: id,
  });
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $push: {
        products: newProduct._id,
      },
    },
    { new: true }
  );
  return { newProduct };
};

exports.updateProduct = async ({ id, newProduct }) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, {
      new: true,
    });
    return updatedProduct;
  } catch (e) {
    throw e;
  }
};
exports.getProduct = async (req, userId) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "order",
      order = "asc",
      inventoryFilter,
      priceMin,
      priceMax,
    } = req.query;
    console.log("search", search);
    const query = { isDeleted: false, user: userId };

    // Search filter
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          itemNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          barcode: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    if (priceMin !== undefined) {
      query.price = { $gte: priceMin };
    }
    if (priceMax !== undefined) {
      query.price = {
        ...query.price,
        $lte: priceMax,
      };
    }
    if (inventoryFilter === "low") {
      query.inventory = { $lt: 1000 };
    } else if (inventoryFilter === "medium") {
      query.inventory = { $gte: 1000, $lte: 5000 };
    } else if (inventoryFilter === "high") {
      query.inventory = { $gt: 5000 };
    }
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    // image append in the productlist
    const productsWithImageUrls = products.map((product) => {
      return {
        ...product._doc, // other data
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/${path.basename(
          product.imageUrl
        )}`,
      };
    });

    return {
      total: totalProducts,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalProducts / limit),
      products: productsWithImageUrls,
    };
  } catch (e) {
    throw e;
  }
};

exports.deleteProductById = async (id) => {
  try {
    const newProduct = await Product.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );
    return newProduct;
  } catch (err) {
    throw e;
  }
};
