exports.notFound = (req, res) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api")) {
    return res.json({ success: false, message: `Route not found: ${req.originalUrl}` });
  }
  res.render("404", { title: "Page Not Found", layout: false });
};

exports.errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err.message);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({ success: false, message: err.message || "Internal Server Error" });
  }
  res.status(statusCode).render("404", { title: "Something Went Wrong", layout: false });
};
