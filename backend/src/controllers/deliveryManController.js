import DeliveryManRequest from "../models/deliveryManRequestSchema.js";
import Delivery from "../models/deliveryModel.js";
import User from "../models/userModel.js";

export const deliveryManRequest = async (req, res) => {
  try {
    const existingRequest = await DeliveryManRequest.findOne({
      userId: req.body.userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    const request = new DeliveryManRequest({
      ...req.body,
      status: "pending",
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeliveryManRequestAdmin = async (req, res) => {
  try {
    const requests = await DeliveryManRequest.find({
      status: "pending",
    }).populate("userId", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAsDeliveryMan = async (req, res) => {
  try {
    const request = await DeliveryManRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = req.body.decision;
    await request.save();

    if (req.body.decision === "approved") {
      await User.findByIdAndUpdate(request.userId, { role: "delivery-man" });
    }

    res.json({ message: `Request ${req.body.decision}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getApprovedDeliveriesForDeliveryMan = async (req, res) => {
  try {
    const { deliveryManId } = req.params;
    const { search, sort } = req.query;

    // Build query
    const query = {
      deliveryManId,
      status: "approved",
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { "deliveryDetails.contactNumber": { $regex: search, $options: "i" } },
        { "payment.transactionId": { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "shop.shopName": { $regex: search, $options: "i" } },
        { deliveryPin: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort options
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "amount-high") sortOption = { "payment.amount": -1 };
    if (sort === "amount-low") sortOption = { "payment.amount": 1 };

    // Add population and logging
    const deliveries = await Delivery.find(query)
      .populate("user", "name phone")
      .populate("shop", "shopName")
      .sort(sortOption)
      .lean(); // Convert to plain JS objects

    if (!deliveries.length) {
      console.log("No deliveries found with query:", query);
    }

    res.json({ deliveries });
  } catch (err) {
    console.error("Error in getApprovedDeliveriesForDeliveryMan:", err);
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
