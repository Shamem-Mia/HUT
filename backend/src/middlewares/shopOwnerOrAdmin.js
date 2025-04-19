import User from "../models/userModel.js";

const shopOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin" || user.role === "delivery-man") {
      req.user = user;
      return next();
    }

    if (user.shop) {
      req.user.shop = user.shop;
      return next();
    }

    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only Admin or Shop Owner can perform this action",
    });
  } catch (err) {
    console.error("shopOwnerOrAdmin middleware error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while verifying user role",
    });
  }
};

export default shopOwnerOrAdmin;
