const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
require("dotenv").config({ path: path.resolve(process.cwd(), "local.env"), override: true, quiet: true });

const requiredEnv = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error("Missing required env vars:", missing.join(", "));
  console.error("Set them in .env or local.env (see .env.example).");
  process.exit(1);
}

const express = require("express");
const app = express();
const salesRoutes = require("./routes/selesRoutes");
const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", salesRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.use(errorHandler);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
});
