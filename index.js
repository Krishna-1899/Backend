const express = require("express");
const app = express();
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
const connect = require("./config/mongodbConnect");
connect();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 40,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
      "Too many requests from this IP, please try again after 5 minutes",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(express.json({ limit: "2024kb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes = require("./routes");
app.use(routes);
PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
  return res.send("welcome to backend");
});
app.listen({ port: PORT }, async () => {
  console.log(`server start on http://localhost:${PORT}`);
});
