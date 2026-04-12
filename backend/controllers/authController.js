// Auth controller
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Please enter both username and password to login."
      });
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
      console.error("Missing auth env vars");
      return res.status(500).json({
        message: "Authentication system is not properly configured. Please contact admin."
      });
    }

    if (username !== ADMIN_USERNAME || !(await bcrypt.compare(password, ADMIN_PASSWORD_HASH))) {
      return res.status(401).json({
        message: "Invalid username or password. Please try again."
      });
    }

    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: "admin" },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      token,
      user: { username: ADMIN_USERNAME, role: "admin" }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Login failed. Please try again or contact admin if the problem persists."
    });
  }
};
