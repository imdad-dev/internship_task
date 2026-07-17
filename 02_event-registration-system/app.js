const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const { notFound, errorHandler } = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const viewRoutes = require("./routes/viewRoutes");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Server-rendered view routes (frontend pages)
app.use("/", viewRoutes);

// 404 handler for unmatched /api routes
app.use("/api", notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
