import {
  approveDeliveriesByAdminAndBoy,
  approveDelivery,
  createDelivery,
  deleteDeliveriesByAdminAndBoy,
  getAllDeliveriesForAdminAndBoy,
  getApproveDeliveriesByAdminAndBoy,
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
import isAdmin from "../middlewares/adminMiddleware.js";
import shopOwnerOrAdmin from "../middlewares/shopOwnerOrAdmin.js";

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
deliveryRouter.put("/:id/verify", authUser, shopOwnerOrAdmin, verifyDelivery);

deliveryRouter.get("/pin/:pin", getDeliveryByPin);

deliveryRouter.get("/admin/pending", getAllDeliveriesForAdminAndBoy);
deliveryRouter.get("/admin/approved", getApproveDeliveriesByAdminAndBoy);
deliveryRouter.put(
  "/admin/:id/approve",
  authUser,
  approveDeliveriesByAdminAndBoy
);
deliveryRouter.delete("/admin/:id/reject", deleteDeliveriesByAdminAndBoy);

export default deliveryRouter;
