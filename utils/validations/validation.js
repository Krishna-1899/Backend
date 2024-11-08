const { body, check } = require("express-validator");
const { findProduct } = require("../../services/productServices");

const loginValidator = [
  body("emailOrPhone")
    .not()
    .isEmpty()
    .withMessage("Credentials Required Either Email or Phone")
    .custom((value, { req }) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
      const phonePattern = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/; // Indian phone number regex
      if (!emailPattern.test(value) && !phonePattern.test(value)) {
        throw new Error("Must be a valid email or Indian phone number");
      }
      return true;
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("The minimum password length is 5 characters"),
];

const createValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("FirstName does not Empty")
    .isLength({ max: 10 })
    .withMessage("FirstName Should Not More than 10"),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("lastname does Not be empty")
    .isLength({ max: 10 })
    .withMessage("Lastname Should Not More than 10"),
  body("email", "Invalid email").isEmail(),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password does not Empty")
    .isLength({ min: 6 })
    .withMessage("The minimum password length is 6 characters"),
  body("phoneNumber")
    .not()
    .isEmpty()
    .withMessage("phoneNumber does not Empty")
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)
    .withMessage("Enter Indian PhoneNumber"),
];
const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 50 })
    .withMessage("Product Title cannot exceed 50 characters"),

  body("description")
    .isLength({ max: 200 })
    .withMessage("Product Description cannot exceed 200 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("inventory")
    .notEmpty()
    .withMessage("Inventory is required")
    .isNumeric()
    .withMessage("Inventory must be a number"),
  body("itemNumber")
    .notEmpty()
    .withMessage("Item Number is required")
    .matches(/^[A-Za-z0-9-]{1,15}$/)
    .withMessage(
      "Item Number can only contain letters, numbers, and hyphens (-), and must be between 1 and 15 characters"
    )
    .custom(async (value, { req }) => {
      const product = await findProduct({
        itemNumber: value,
        user: req.user.id,
      });
      if (product) {
        throw new Error("Item Number must be unique for each user");
      }
      return true;
    }),
  body("barcode")
    .notEmpty()
    .withMessage("Barcode is required")
    .matches(/^[0-9]{1,15}$/)
    .withMessage("Barcode must be numeric and up to 15 characters")
    .custom(async (value, { req }) => {
      const product = await findProduct({
        barcode: value,
        user: req.user.id,
      });
      if (product) {
        throw new Error("Barcode must be unique for each user");
      }
      return true;
    }),
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Product Image is required");
    }
    return true;
  }),
];
const updateProductValidator = [
  body("title")
    .isLength({ max: 50 })
    .withMessage("Product Title cannot exceed 50 characters"),
  body("description")
    .isLength({ max: 200 })
    .withMessage("Product Description cannot exceed 200 characters"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("inventory").optional().isNumeric().withMessage("Inventory must be a number"),
];
const updateProductOrderValidator = [
  body("movedId").not().isEmpty().withMessage("Product Id is Required"),
  // body("productThatisDragged").isObject({strict: true}).not().isEmpty().withMessage("Product That is Dragged Is Required"),
  // body("productThatInterChange").isObject({strict: true}).not().isEmpty().withMessage("Product That is InterChanged Is Required"),
  body("productThatisDragged")
    .isObject({ strict: true })
    .withMessage("Product That is Dragged must be an object")
    .custom((value) => {
      if (!Object.keys(value).length) {
        throw new Error("Product That is Dragged cannot be empty");
      }
      return true;
    }),

  body("productThatInterChange")
    .isObject({ strict: true })
    .withMessage("Product That is InterChanged must be an object")
    .custom((value) => {
      if (!Object.keys(value).length) {
        throw new Error("Product That is InterChanged cannot be empty");
      }
      return true;
    }),
];
module.exports = {
  createValidator,
  loginValidator,
  createProductValidator,
  updateProductValidator,
  updateProductOrderValidator,
};
