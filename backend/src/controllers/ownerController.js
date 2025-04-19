import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

export const shopOwnershipRequest = async (req, res) => {
  try {
    const {
      shopName,
      localAreas,
      permanentAddress,
      shopCategory,
      contactNumber,
      BkashNumber,
      NagadNumber,
      selfDelivery,
      additionalInfo,
    } = req.body;
    const userId = req.user._id;

    if (!localAreas || !Array.isArray(localAreas) || localAreas.length === 0) {
      return res.status(400).json({
        message: "At least one local area is required",
      });
    }

    // Check if user already has a pending or approved shop
    const existingShop = await Shop.findOne({ owner: userId });
    if (existingShop) {
      return res.status(400).json({
        message:
          existingShop.status === "pending"
            ? "You already have a pending request"
            : "You are already a shop owner",
      });
    }

    // Find the last user's PIN or start with 56200 if no users exist
    const lastShop = await Shop.findOne().sort({ pin: -1 });
    const newPin = lastShop ? lastShop.shopPin + 1 : 56200;

    const newShop = new Shop({
      shopName,
      localAreas: localAreas.map((area) => area.trim()).filter((area) => area),
      permanentAddress,
      shopCategory,
      contactNumber,
      BkashNumber,
      NagadNumber,
      selfDelivery,
      additionalInfo: additionalInfo || "",
      owner: userId,
      status: "pending",
      shopPin: newPin,
    });

    await newShop.save();

    res.status(201).json({
      message: "Shop request submitted successfully",
      shop: newShop,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShopOwnershipRequests = async (req, res) => {
  try {
    const requests = await Shop.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve shop ownership
export const approveShopOwnership = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    ).populate("owner", "name email");

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop request not found" });
    }

    const existingUser = await User.findOne({
      email: updatedShop.owner.email,
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.role = "shop-owner";
    existingUser.shop = updatedShop._id;
    await existingUser.save();

    //  send an email notification to the owner later

    res.json({
      message: "Shop approved successfully",
      shop: updatedShop,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject shop ownership
export const rejectShopOwnership = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByIdAndDelete(id).populate(
      "owner",
      "name email"
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop request not found" });
    }

    // Here you would typically send a rejection email to the owner
    // Example: sendRejectionEmail(shop.owner.email, shop.shopName);

    res.json({
      message: "Shop request rejected and removed",
      shop,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
