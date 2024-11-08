const {
  findUserWithEmailOrPhone,
  findUserByEmailOrMobile,
  createUser,
} = require("../services/authServices");
const {
  verifyPassword,
  generateToken,
  hashedPassword,
} = require("../utils/utils");
require("dotenv").config();
exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const user = await findUserByEmailOrMobile({ email, phoneNumber });
    if (user) {
      return res.status(404).json({
        success: false,
        message: "User Already Exits With This Email or Phone Number",
      });
    }
    const hashPassword = await hashedPassword(password);
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
    });
    return res.status(201).json({
      success: true,
      data: newUser,
      message: "User Created Successfully",
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await findUserWithEmailOrPhone({
      emailOrPhone,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Does Not exits , Please Register First",
      });
    }
    if (!(await verifyPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "User Credentials Are Wrong",
      }); //password incorrect
    }
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = generateToken(payload);
    user.token = token;

    user.password = undefined;
    return res.status(200).json({
      success: true,
      token: token,
      user,
      message: "User Login SuccessFully",
    });
  } catch (e) {
    res.status(500).json({
      message: `Something Went Wrong ${e.message}`,
    });
  }
};
