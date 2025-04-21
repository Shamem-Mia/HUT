import mongoose from "mongoose";
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
      shop: req.body.shopId,
    });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (Number(delivery.deliveryPin) !== Number(req.body.pin)) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    const existingShop = await Shop.findOne({ _id: req.body.shopId });
    if (!existingShop) {
      return res.status(404).json({ message: "shop not found!" });
    }
    const existingUser = await User.findOne({ email: req.user.email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    existingShop.totalSellPrice =
      existingShop.totalSellPrice + delivery.payment.amount;
    await existingShop.save();

    // Update user's delivered coin count
    existingUser.deliveredCoin = (existingUser.deliveredCoin || 0) + 1;
    await existingUser.save();

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

    res.status(200).json({ delivery, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDeliveriesForAdminAndBoy = async (req, res) => {
  try {
    const { search, shop, sort } = req.query;

    // Build query
    const query = {
      status: "pending",
      selfDelivery: false,
    };

    // Add search filter
    if (search) {
      query.$or = [
        { "deliveryDetails.contactNumber": { $regex: search, $options: "i" } },
        { "payment.transactionId": { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "shop.shopName": { $regex: search, $options: "i" } },
      ];
    }

    // Add shop filter - FIXED: now filters by _id instead of shopName
    if (shop && shop !== "all" && mongoose.Types.ObjectId.isValid(shop)) {
      query.shop = new mongoose.Types.ObjectId(shop);
    } else if (shop && shop !== "all") {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "amount-high") sortOption = { "payment.amount": -1 };
    if (sort === "amount-low") sortOption = { "payment.amount": 1 };

    const deliveries = await Delivery.find(query)
      .populate("user", "name phone")
      .populate("shop", "shopName")
      .sort(sortOption);

    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApproveDeliveriesByAdminAndBoy = async (req, res) => {
  try {
    const { search, status, shop, sort } = req.query;

    // Build query
    const query = {
      status: { $in: ["approved", "delivered"] },
      selfDelivery: false,
    };

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }
    // Add search filter
    if (search) {
      query.$or = [
        { "deliveryDetails.contactNumber": { $regex: search, $options: "i" } },
        { "payment.transactionId": { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "shop.shopName": { $regex: search, $options: "i" } },
        { deliveryPin: { $regex: search, $options: "i" } },
      ];
    }

    // Add shop filter
    if (shop && shop !== "all" && mongoose.Types.ObjectId.isValid(shop)) {
      query.shop = new mongoose.Types.ObjectId(shop);
    } else if (shop && shop !== "all") {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "amount-high") sortOption = { "payment.amount": -1 };
    if (sort === "amount-low") sortOption = { "payment.amount": 1 };

    const deliveries = await Delivery.find(query)
      .populate("user", "name phone")
      .populate("shop", "shopName")
      .sort(sortOption);

    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveDeliveriesByAdminAndBoy = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const deliveryPin = Math.floor(1000 + Math.random() * 9000);
    delivery.status = "approved";
    delivery.deliveryPin = deliveryPin;
    delivery.deliveryManId = req?.user?._id;
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

export const deleteDeliveriesByAdminAndBoy = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    res.json({
      success: true,
      message: "Delivery rejected successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
