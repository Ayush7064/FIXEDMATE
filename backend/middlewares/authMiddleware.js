const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

// Middleware to verify token and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user/provider object to req
      if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      } else if (decoded.role === "service-provider") {
        req.user = await ServiceProvider.findById(decoded.id).select("-password");
      }

      req.role = decoded.role;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Optional: Role-based access middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permission" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
