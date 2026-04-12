// JWT auth middleware
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "You do not have permission to access this. Please login first."
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "Invalid or expired token. Please login again."
          });
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Authentication failed. Please try again."
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "You do not have permission to perform this action."
    });
  }
  next();
};
