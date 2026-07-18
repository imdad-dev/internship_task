const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

const indexRoutes = require("./routes/indexRoutes");
const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tableRoutes = require("./routes/tableRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "partials/layout");

// ---------- Core Middleware ----------
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Sessions & Flash (for admin auth) ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "restaurant_secret",
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGO_URI
      ? MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: "sessions" })
      : undefined,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
  })
);
app.use(flash());

// Make flash messages & current path available in every view
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentPath = req.path;
  res.locals.admin = req.session.admin || null;
  next();
});

// ---------- Page Routes ----------
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);

// ---------- API Routes ----------
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
