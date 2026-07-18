const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

const indexRoutes = require("./routes/indexRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const employerRoutes = require("./routes/employerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminApiRoutes = require("./routes/adminApiRoutes");
const candidateApiRoutes = require("./routes/candidateApiRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "partials/layout");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "job_board_secret",
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGO_URI
      ? MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: "sessions" })
      : undefined,
    cookie: { maxAge: 1000 * 60 * 60 * 8 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentPath = req.path;
  res.locals.candidate = req.session.candidate || null;
  res.locals.employer = req.session.employer || null;
  res.locals.admin = req.session.admin || null;
  next();
});

// Pages
app.use("/", indexRoutes);
app.use("/candidate", candidateRoutes);
app.use("/employer", employerRoutes);
app.use("/admin", adminRoutes);

// APIs
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminApiRoutes);
app.use("/api/candidate", candidateApiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
