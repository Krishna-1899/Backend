const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  console.log("file", file);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp and avif) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 }, // 1MB file size limit
});
const uploadFile = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("error in  multer", err);
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message:
            "Expected field named 'image' in multipart/form-data request For File Upload",
        });
      } else if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: err.message,
        });
      } else {
        return res.status(415).json({ success: false, message: err.message });
      }
    }
    next();
  });
};
module.exports = uploadFile;
