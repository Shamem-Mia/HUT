import {
  approveDelivery,
  createDelivery,
  getDeliveryByPin,
  getPendingDeliveries,
  getShopDeliveries,
  getUserDeliveries,
  rejectDelivery,
  verifyDelivery,
} from "../controllers/deliveryController.js";
import optionalAuthUser from "../middlewares/optionalAuth.js";
import shopOwner from "../middlewares/shopOwnerMiddleware.js";
import authUser from "../middlewares/userAuth.js";
import express from "express";

const deliveryRouter = express.Router();

// Create new delivery
deliveryRouter.post("/", optionalAuthUser, createDelivery);

// Get deliveries for user
deliveryRouter.get("/user", optionalAuthUser, getUserDeliveries);

// Get deliveries for shop owner
deliveryRouter.get("/shop", authUser, getShopDeliveries);

deliveryRouter.get("/pending", authUser, shopOwner, getPendingDeliveries);
// deliveryRouter.patch("/:id/approve", authUser, shopOwner, approveDelivery);
deliveryRouter.put("/:id/approve", authUser, shopOwner, approveDelivery);
deliveryRouter.delete("/:id/reject", authUser, shopOwner, rejectDelivery);

// Verify delivery PIN
deliveryRouter.put("/:id/verify", authUser, shopOwner, verifyDelivery);

deliveryRouter.get("/pin/:pin", getDeliveryByPin);

export default deliveryRouter;
