const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to sign a JWT for a given user id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper to send token as httpOnly cookie + JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
  };

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @route  POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide name, email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    // Only allow "organizer" role if explicitly requested; default "user"
    const user = await User.create({
      name,
      email,
      password,
      role: role === "organizer" ? "organizer" : "user",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/logout
exports.logoutUser = (req, res) => {
  res.cookie("token", "none", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @route  GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
