const services = require("../services/getSalesData");
const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const asyncHandler = require("../middlewares/asyncHandler");

const ALLOWED_EXTENSIONS = ["csv", "xlsx", "xls"];
const ALLOWED_MIMES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const getProductData = asyncHandler(async (req, res) => {
  const result = await services.getProducts();
  res.json({ success: true, data: result.rows });
});

const handleFileUpload = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded. Send a file using the 'file' field.",
    });
  }

  const ext = req.file.originalname.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      success: false,
      error: "Invalid file type. Allowed: CSV, XLSX, XLS.",
    });
  }

  if (!ALLOWED_MIMES.includes(req.file.mimetype) && ext !== "csv") {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      success: false,
      error: "Invalid file MIME type.",
    });
  }

  const filePath = req.file.path;

  try {
    if (ext === "csv") {
      const rows = await new Promise((resolve, reject) => {
        const result = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => result.push(data))
          .on("end", () => resolve(result))
          .on("error", reject);
      });
      if (rows.length === 0) {
        fs.unlink(filePath, () => {});
        return res.status(400).json({
          success: false,
          error: "CSV file is empty or has no valid rows.",
        });
      }
      const result = await services.insertData(rows);
      fs.unlink(filePath, () => {});
      return res.json({ success: true, data: result });
    }

    if (ext === "xlsx" || ext === "xls") {
      const workBook = XLSX.readFile(filePath);
      const sheetName = workBook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      if (!data || data.length === 0) {
        fs.unlink(filePath, () => {});
        return res.status(400).json({
          success: false,
          error: "Spreadsheet is empty or has no valid rows.",
        });
      }
      const result = await services.insertData(data);
      fs.unlink(filePath, () => {});
      return res.json({ success: true, data: result });
    }
  } finally {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}
  }
});

module.exports = { getProductData, handleFileUpload };
