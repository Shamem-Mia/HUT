import mongoose from "mongoose";
import Shop from "../models/shopModel.js";

export const getShopById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: "Failed to fetch shop details",
    });
  }
};

export const getShopFromFoodItem = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .select(
        "shopName BkashNumber NagadNumber localAreas shopCategory contactNumber deliveryCharge"
      )
      .lean();

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({
      message: "Failed to fetch shop details",
      error: error.message,
    });
  }
};

export const updateDeliveryCharge = async (req, res) => {
  try {
    const { deliveryCharge } = req.body;

    if (!Array.isArray(deliveryCharge)) {
      return res
        .status(400)
        .json({ error: "Delivery charge must be an array" });
    }

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { deliveryCharge },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (err) {
    console.error("Error updating delivery charges:", err);
    res.status(500).json({ error: "Failed to update delivery charges" });
  }
};

export const getShopByPin = async (req, res) => {
  try {
    const shopPin = parseInt(req.params.shopPin);
    if (isNaN(shopPin)) {
      return res.status(400).json({ message: "Invalid shop PIN" });
    }

    const shop = await Shop.findOne({ shopPin });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: "Failed to fetch shop by PIN",
    });
  }
};

export const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.isBlock) {
      shop.isOpen = false;
      await shop.save();
    } else {
      shop.isOpen = !shop.isOpen;
      await shop.save();
    }

    res.status(200).json({
      success: true,
      message: `Shop is now ${shop.isOpen ? "open" : "closed"}`,
      isOpen: shop.isOpen,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: "Failed to toggle shop status",
    });
  }
};

export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Format phone numbers to ensure they start with 0
    const formatPhoneNumber = (num) => {
      if (!num) return num;
      const numStr = num.toString();
      return numStr.startsWith("0") ? numStr : `0${numStr}`;
    };

    if (updates.contactNumber) {
      updates.contactNumber = formatPhoneNumber(updates.contactNumber);
    }
    if (updates.BkashNumber) {
      updates.BkashNumber = formatPhoneNumber(updates.BkashNumber);
    }
    if (updates.NagadNumber) {
      updates.NagadNumber = formatPhoneNumber(updates.NagadNumber);
    }

    // Convert comma-separated strings to arrays if needed
    if (typeof updates.localAreas === "string") {
      updates.localAreas = updates.localAreas
        .split(",")
        .map((area) => area.trim());
    }
    if (typeof updates.deliveryCharge === "string") {
      updates.deliveryCharge = updates.deliveryCharge
        .split(",")
        .map((charge) => parseFloat(charge.trim()));
    }

    const shop = await Shop.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset delivery count
export const resetDeliveryCount = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        deliveryCount: 0,
        lastResetDate: Date.now(),
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery count reset successfully",
      data: shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
