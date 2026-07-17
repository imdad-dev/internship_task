const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verifies JWT sent via cookie or Authorization header
const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists." });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// Restrict access to specific roles, e.g. authorize("organizer")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : "guest"}' is not allowed to perform this action.`,
      });
    }
    next();
  };
};

// Optional auth - attaches user if token exists, but does not block the request
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    req.user = null;
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
