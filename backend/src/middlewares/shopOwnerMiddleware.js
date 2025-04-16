import User from "../models/userModel.js";

const shopOwner = async (req, res, next) => {
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

    // Check if user has a shop (is a shop owner)
    if (!user.shop) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only shop owners can perform this action",
      });
    }

    // Attach the shop ID to the request for easier access in controllers
    req.user.shop = user.shop;
    next();
  } catch (err) {
    console.error("Shop owner middleware error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while verifying shop owner status",
    });
  }
};

export default shopOwner;
