const User = require("../models/userModel");
exports.findUserWithEmailOrPhone = async ({ emailOrPhone }) => {
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });
    return user;
  } catch (e) {
    throw e;
  }
};
exports.findUserByEmailOrMobile = async ({ email, phoneNumber }) => {
  const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  return user;
};

exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
}) => {
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });
    return newUser;
  } catch (e) {
    throw e;
  }
};
