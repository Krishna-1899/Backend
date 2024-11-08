const rateLimit = require("express-rate-limit");

const limiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    handler: (_req, res) => {
      res.status(429).json({
        error:
          "Sorry, Too many requests from this IP, Please try again after few minutes",
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = limiter;
