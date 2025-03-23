import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// For development, we'll use a hardcoded admin user
// In production, this should come from a database
const ADMIN_USER = {
  username: "admin",
  // This is a hashed version of "admin"
  password: "$2b$10$QFxh8CUdbiz6sMcnxY71guyu9j05IkZpNn3tGMG2JqvcHaUvGGg16",
  role: "admin",
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    if (username !== ADMIN_USER.username) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, ADMIN_USER.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: ADMIN_USER.username, role: ADMIN_USER.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Send response
    res.json({
      token,
      user: {
        username: ADMIN_USER.username,
        role: ADMIN_USER.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
