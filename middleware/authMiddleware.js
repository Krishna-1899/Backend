const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// This is  middleware to check token and field validator
exports.auth = async (req, res, next) => {
  try {
    const url = req.originalUrl;
    const publicRoutes = ["/api/v1/signup", "/api/v1/login"];
    if (!req.headers.authorization && publicRoutes.includes(url)) {
      next();
    } else {
      if (!publicRoutes.includes(url)) {
        let token;
        if (req.headers.authorization) {
          token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");
        }
        // If JWT is missing, return 401 Unauthorized
        if (!token) {
          return res
            .status(401)
            .json({ success: false, message: `Token Missing` });
        }
        try {
          // Verifying the JWT using the secret key stored in environment variables
          const decode = await jwt.verify(token, process.env.JWT_SECRET);
          // Storing the decoded JWT payload in the request object for further use
          req.user = decode;
        } catch (error) {
          // If JWT verification fails, return 401 Unauthorized response
          return res
            .status(401)
            .json({ success: false, message: "Token is invalid" });
        }
      }
      next();
    }
  } catch (error) {
    console.log("error", error);
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong ${error}`,
    });
  }
};
