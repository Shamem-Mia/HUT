import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const optionalAuthUser = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      // No token found, proceed without authentication
      req.user = null;
      return next();
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.email) {
      // Invalid token structure, proceed without authentication
      req.user = null;
      return next();
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: decodedToken.email });

    // Attach user to request if found
    req.user = existingUser || null;
    next();
  } catch (error) {
    console.error("Optional authentication error:", error);

    // For any error (expired, invalid, etc.), just proceed without authentication
    req.user = null;
    next();
  }
};

export default optionalAuthUser;
