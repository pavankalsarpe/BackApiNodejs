require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE || "5242880", 10); 

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").slice(1).toLowerCase();
  const allowed = ["csv", "xlsx", "xls"];
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: CSV, XLSX, XLS."), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

module.exports = upload;