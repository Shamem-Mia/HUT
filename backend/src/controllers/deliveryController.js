import Delivery from "../models/deliveryModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import cron from "node-cron";

// Create new delivery
export const createDelivery = async (req, res) => {
  try {
    const deliveryData = {
      ...req.body,
      status: "pending",
    };

    // Add user ID if authenticated
    if (req.user?.id) {
      deliveryData.user = req.user.id;
    }

    const delivery = new Delivery(deliveryData);

    await delivery.save();

    // Update shop's delivery count
    await Shop.findByIdAndUpdate(delivery.shop, {
      $inc: { deliveryCount: 1 },
    });

    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// For getting pending deliveries (new function)
export const getPendingDeliveries = async (req, res) => {
  try {
    // Only find deliveries that are pending approval
    const deliveries = await Delivery.find({
      shop: req.user.shop,
      status: "pending",
    }).populate("user", "name phone");

    res.status(200).json({
      success: true,
      deliveries,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// For approving deliveries (new function)
export const approveDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      _id: req.params.id,
      shop: req.user.shop,
      status: "pending",
    });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    // Generate PIN only when approved (moved from createDelivery)
    const deliveryPin = Math.floor(1000 + Math.random() * 9000);

    delivery.status = "approved";
    delivery.deliveryPin = deliveryPin;
    await delivery.save();

    res.json({
      success: true,
      message: "Delivery approved successfully",
      delivery,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// For rejecting deliveries (new function)
export const rejectDelivery = async (req, res) => {
  try {
    // Find and delete in one operation
    const delivery = await Delivery.findOneAndDelete({
      _id: req.params.id,
      shop: req.user.shop,
      status: "pending", // Only reject pending deliveries
    });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    res.json({
      success: true,
      message: "Delivery rejected and removed successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get deliveries for user (customer)
export const getUserDeliveries = async (req, res) => {
  try {
    let deliveries;

    if (req.user?.id) {
      // For authenticated users
      deliveries = await Delivery.find({ user: req.user.id }).populate(
        "shop",
        "shopName"
      );
    } else if (req.query.guestKey) {
      // For guest users
      deliveries = await Delivery.find({
        guestKey: req.query.guestKey,
      }).populate("shop", "shopName");
    } else {
      return res.status(400).json({
        success: false,
        message: "Either user authentication or guest key is required",
      });
    }

    res.status(200).json({
      success: true,
      deliveries,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get deliveries for shop owner
export const getShopDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      shop: req.user.shop,
      status: { $in: ["approved", "delivered"] },
    }).populate("user", "name phone");

    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify delivery PIN
export const verifyDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      _id: req.params.id,
      shop: req.user.shop,
    });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (Number(delivery.deliveryPin) !== Number(req.body.pin)) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    const existingShop = await Shop.findOne({ _id: req.user.shop });
    if (!existingShop) {
      return res.status(404).json({ message: "shop not found!" });
    }

    existingShop.totalSellPrice =
      existingShop.totalSellPrice + delivery.payment.amount;
    await existingShop.save();

    delivery.status = "delivered";
    delivery.verifiedAt = new Date();
    await delivery.save();

    res.status(200).json({
      ...delivery.toObject(),
      verifiedAt: delivery.verifiedAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetShopStats = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        totalSellPrice: 0,
        sellDays: 0,
        lastResetDate: null,
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
      success: true,
      message: "Shop stats reset successfully",
      shop,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: "Failed to reset shop stats",
    });
  }
};

// Get delivery by PIN
export const getDeliveryByPin = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      deliveryPin: req.params.pin,
    }).populate("user shop", "name shopName");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const user = await User.findOne({ _id: delivery?.user }).populate(
      "fullName email",
      "name email"
    );
    console.log("user:", user);

    res.status(200).json({ delivery, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
