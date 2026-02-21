
function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== "production";

  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "File too large.";
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    status = 400;
    message = "Unexpected file field. Use 'file' for the upload.";
  } else if (message.includes("Invalid file type")) {
    status = 400;
  }


  if (!isDev && status === 500) {
    message = "Internal server error";
  }

  if (isDev && err.stack) {
    console.error("[Error]", err.stack);
  } else if (status >= 500) {
    console.error("[Error]", message, err.code || "");
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(isDev && err.code && { code: err.code }),
  });
}

module.exports = errorHandler;
