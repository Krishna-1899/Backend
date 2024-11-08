const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//function for hashing the password
async function hashedPassword(password) {
  let hashedPassword;
  return (hashedPassword = await bcrypt.hash(password, 10));
}
//verify userpassword
async function verifyPassword(UserPassword, actualPassword) {
  return await bcrypt.compare(UserPassword, actualPassword);
}
//generate jwt token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
}
//verify token to pass in decode and then in req.user
function verifyJwtToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = {
  hashedPassword,
  verifyPassword,
  generateToken,
  verifyJwtToken,
};
